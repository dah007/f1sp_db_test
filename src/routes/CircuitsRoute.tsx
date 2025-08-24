import { CIRCUIT_DETAILS } from '@/constants/circuitConstants';
import PageContainer from 'components/PageContainer';
import { useAppDispatch } from 'hooks/reduxHooks';
import mapboxgl from 'mapbox-gl';
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gotoCircuit, loadCircuitLayers, SHOW_PIN_ZOOM, updateMarkerVisibility } from './Circuits/CircuitFunctions';

import { RootState, useAppSelector } from '@/app/store';
import Card from '@/components/Card';
import CircuitSelect from '@/components/CircuitSelect';
import { CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BUTTON_CLASSES } from '@/constants/constants';
import { setError } from '@/slices/systemWideSlice';
import { intlNumberFormat } from '@/utils/number';
import { CircuitProps } from 'types/circuits';

const Circuits: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();

    const raceNext = useAppSelector((state: RootState) => state.races.raceNext);
    console.log('raceNext', raceNext);
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const mapContainer = useRef<HTMLDivElement>(null);

    const [circuit, setCircuit] = useState(
        CIRCUIT_DETAILS[raceNext?.circuit_name ? raceNext.circuit_name.toLowerCase() : 'baku'],
    );
    const [circuitBBox, setCircuitBBox] = useState<CircuitProps['bbox']>(
        CIRCUIT_DETAILS[raceNext?.circuit_name ? raceNext.circuit_name.toLowerCase() : 'baku']?.bbox,
    );
    const [circuitAltitude, setCircuitAltitude] = useState<number | undefined>(
        CIRCUIT_DETAILS[raceNext?.circuit_name ? raceNext.circuit_name.toLowerCase() : 'baku']?.altitude,
    );
    const [circuitLength, setCircuitLength] = useState<number | undefined>(circuit?.length);
    const [circuitOpened, setCircuitOpened] = useState<number | undefined>(circuit?.opened);
    const [circuitTimezone, setCircuitTimezone] = useState<string | undefined>(circuit?.timezone?.name);
    const [, /*circuitTurns*/ setCircuitTurns] = useState<number | undefined>(circuit?.turns);
    const [continent, setContinent] = useState<string | undefined>('Europe');
    const [firstGp, setFirstGp] = useState<number | undefined>(circuit?.firstgp);
    const [lat, setLat] = useState<number>(42.35);
    const [lng, setLng] = useState<number>(-70.9);
    const [, /*zoom*/ setZoom] = useState<number>(9);

    const mapCircuitInfo = useMemo(
        () => ({
            altitude: circuit.altitude,
            continent: circuit.continent,
            circuit: circuit, // full circuit object, for reference
            firstGp: circuit?.firstgp,
            lat: circuit.latitude ?? 42.35,
            length: circuitLength,
            lng: circuit.longitude ?? -70.9,
            opened: circuit.opened,
            timezone: circuit.timezone?.name,
            turns: circuit.turns,
        }),
        [circuit, circuitLength],
    );

    // console.log('mapCircuitInfo', mapCircuitInfo);

    // Function to recenter the map to original bbox
    const recenterMap = () => {
        if (!map.current || !circuitBBox) return;

        map.current.fitBounds(circuitBBox, {
            padding: 20,
            maxZoom: SHOW_PIN_ZOOM,
        });
        setShowRecenterButton(false);
    };

    const map = useRef<mapboxgl.Map | null>(null);

    const [showRecenterButton, setShowRecenterButton] = useState<boolean>(false);

    // Function to check if current view is outside original bbox
    const isOutsideOriginalBounds = useCallback(() => {
        if (!map.current || !circuitBBox) return false;

        const currentBounds = map.current.getBounds();
        if (!currentBounds) return false;

        // Ensure circuitBBox is an array with 4 elements [sw_lng, sw_lat, ne_lng, ne_lat]
        if (!Array.isArray(circuitBBox) || circuitBBox.length !== 4) return false;

        const [sw_lng, sw_lat, ne_lng, ne_lat] = circuitBBox;

        // Add some tolerance (padding) to avoid flickering
        const tolerance = 0.01;

        return (
            currentBounds.getSouth() < sw_lat - tolerance ||
            currentBounds.getNorth() > ne_lat + tolerance ||
            currentBounds.getWest() < sw_lng - tolerance ||
            currentBounds.getEast() > ne_lng + tolerance
        );
    }, [circuitBBox]);

    useEffect(() => {
        if (!raceNext) return;

        try {
            setLng(-1.02602); // silverstone
            setLat(52.09216);
            if (mapContainer.current) {
                map.current = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/dark-v11',
                    center: [-1.02602, 52.09216], // Silverstone, UK
                    zoom: 9,
                    maxZoom: 15,
                    renderWorldCopies: true, // Better handling of markers at map edges
                    fadeDuration: 0, // Reduces lag when moving
                    trackResize: true,
                    attributionControl: false, // We'll add this separately if needed
                    antialias: true, // Smoother rendering
                    maxPitch: 60, // Limit pitch for better performance
                    minZoom: 2, // Limit min zoom for better performance
                    preserveDrawingBuffer: false, // Better performance
                });

                map.current.on('load', () => {
                    if (!map) return;

                    loadCircuitLayers({
                        data: CIRCUIT_DETAILS,
                        map: map.current!,
                    });
                    console.log('ON LOAD');
                    map.current?.fitBounds(circuitBBox, {
                        padding: 20,
                        maxZoom: SHOW_PIN_ZOOM,
                    });
                });

                map.current.on('moveend', () => {
                    if (!mapContainer.current) return;
                    // Update UI coordinates
                    setLng(map.current?.getCenter().lng.toFixed(4) as unknown as number);
                    setLat(map.current?.getCenter().lat.toFixed(4) as unknown as number);
                    setZoom(map.current?.getZoom().toFixed(2) as unknown as number);
                    console.log('setting map lng/lat');
                    // console.log('map move end, new circuit?', circuit);
                });

                // During movement, do nothing to avoid performance issues
                const moveHandler = () => {
                    // Intentionally empty - we manage markers at the start/end of movements instead
                    updateMarkerVisibility(map.current?.getZoom() || 14);
                };

                map.current.on('move', moveHandler);

                // Clean up on unmount
                return () => {
                    map.current?.off('move', moveHandler);
                    map.current?.remove();
                };
            }
        } catch (error) {
            dispatch(setError(true));
            console.error('Error creating map:', error);
            return;
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [dispatch, raceNext]);

    useEffect(() => {
        if (isOutsideOriginalBounds()) {
            console.log('outside original bounds');
            setCircuitAltitude(-1000);
            setCircuitLength(-1);
            setCircuitOpened(-1);
            setFirstGp(-1);
            setCircuitTimezone('-');
            setCircuitTurns(-1);
            setShowRecenterButton(true);
        }
        // else {
        //     console.log('inside original bounds');
        //     setCircuitAltitude(circuit?.altitude);
        //     setCircuitBBox(circuit?.bbox);
        //     setCircuitLength(circuit?.length);
        //     setCircuitOpened(circuit?.opened);
        //     setFirstGp(circuit?.firstgp);
        //     setCircuitTimezone(circuit?.timezone?.name);
        //     setCircuitTurns(circuit?.turns);
        //     setShowRecenterButton(false);
        // }
        // Check if we should show the recenter button

        if (map.current && circuit?.bbox) {
            console.log('Circuit changed, navigating to new circuit:', circuit.full_name);
            map.current.fitBounds(circuit.bbox, {
                padding: 20,
                maxZoom: SHOW_PIN_ZOOM,
            });
        }

        //     // Update circuit-related state
        //     setCircuitBBox(circuit.bbox);
        //     setCircuitAltitude(circuit.altitude);
        //     setCircuitLength(circuit.length);
        //     setCircuitOpened(circuit.opened);
        //     setFirstGp(circuit.firstgp);
        //     setCircuitTimezone(circuit.timezone?.name);
        //     setCircuitTurns(circuit.turns);
        // }
    }, [circuit, isOutsideOriginalBounds]); // This effect runs when circuit or circuitBBox changes

    useEffect(() => {
        if (circuit) {
            setCircuitAltitude(circuit?.altitude);
            setCircuitBBox(circuit?.bbox);
            setCircuitLength(circuit?.length);
            setCircuitOpened(circuit?.opened);
            setFirstGp(circuit?.firstgp);
            setCircuitTimezone(circuit?.timezone?.name);
            setCircuitTurns(circuit?.turns);
            setShowRecenterButton(false);
            console.log('NO BIGGY mapCircuitInfo update?', mapCircuitInfo);
        }
    }, [circuit, mapCircuitInfo]);

    return (
        <PageContainer title="Circuits" showBreadcrumbs showTitle className="gap-4 h-[80vh]" useScrollArea={false}>
            <Card className="z-10 h-[12vh] mb-4">
                <CardHeader>
                    {circuit?.official_name || 'Circuit Name'}
                    <CardDescription>
                        Lat/Long: {lat}, {lng} - Altitude: {circuitAltitude !== -1000 ? circuitAltitude : 'Unknown'}
                    </CardDescription>
                </CardHeader>

                <CardContent className="text-sm mb-4 flex gap-10">
                    <ScrollArea className="w-full h-[15vh]">
                        <div className="w-fit">
                            <div>Opened: {circuitOpened !== -1 ? circuitOpened : 'Unknown'}</div>
                            <div>First GP: {firstGp !== -1 ? firstGp : 'Unknown'}</div>
                            {/* <div>Turns: {circuitTurns !== -1 ? circuitTurns : 'Unknown'}</div> */}
                        </div>
                        <div>
                            <div>
                                Length:{' '}
                                {circuitLength && circuitLength !== -1
                                    ? intlNumberFormat(circuitLength / 1000) || 'Unknown'
                                    : 'Unknown'}{' '}
                                km
                            </div>
                            <div>Timezone: {circuitTimezone !== '-' ? circuitTimezone : 'Unknown'}</div>
                            <div>
                                Wiki:{' '}
                                {circuit.wiki ? (
                                    <a
                                        href={circuit.wiki}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline text-blue-500"
                                    >
                                        Link
                                    </a>
                                ) : (
                                    'Unknown'
                                )}
                            </div>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* NEW MAP! */}
            <div className="rounded-xl shadow-sm overflow-hidden border-zinc-700 relative">
                <div className={`flex gap-4 mb-4 absolute top-4 left-4 z-[9999]`}>
                    <CircuitSelect
                        circuitsData={CIRCUIT_DETAILS || []}
                        circuit={circuit || CIRCUIT_DETAILS['baku']}
                        map={map.current}
                        setCircuit={setCircuit}
                        setContinent={setContinent}
                        gotoCircuit={gotoCircuit}
                    />
                    {/* <ContinentSelect
                        continent={continent || 'Europe'}
                        map={map.current || null}
                        setCircuit={(circuit) => setCircuit(circuit || CIRCUIT_DETAILS['baku'])}
                        setContinent={setContinent}
                        gotoContinent={gotoContinent}
                    /> */}
                </div>

                {/* Recenter Button */}
                {showRecenterButton && (
                    <button
                        onClick={recenterMap}
                        className={`absolute top-4 right-4 z-[9999] ${BUTTON_CLASSES} text-zinc-400 px-4 py-2 rounded-md shadow-lg transition-colors`}
                        title="Recenter to circuit view"
                    >
                        📍 Recenter
                    </button>
                )}

                <div
                    className="relative"
                    ref={mapContainer}
                    style={{
                        borderRadius: '0.75rem',
                        borderColor: 'rgb(63, 63, 71)',
                        borderWidth: '1px',
                        marginTop: '8px',
                        width: '100%',
                        height: '60vh',
                        zIndex: 100,
                    }}
                />
            </div>
            {/* </newMap> */}
        </PageContainer>
    );
};

export default Circuits;
