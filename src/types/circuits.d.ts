export type BBoxType = LngLatBounds | [LngLatLike, LngLatLike] | [number, number, number, number];

export type CircuitProps = {
    altitude?: number;
    bbox: BBoxType;
    circuitType: string | undefined;
    continent?: string;
    country: string | undefined;
    date?: string | undefined;
    firstgp: number | undefined;
    full_name: string | undefined;
    id: string;
    latitude: number;
    length: number | undefined;
    longitude: number;
    name: string | undefined;
    official_name: string | undefined;
    opened: number | undefined;
    place_name: string | undefined;
    raceDate?: string | undefined;
    shortName: string | undefined;
    timezone: {
        dst: boolean;
        offset: number;
        start: {
            month: number;
            day: number;
            hour: number;
        };
        end: {
            month: number;
            day: number;
            hour: number;
        };
        name: string | undefined;
    };
    turns?: number | undefined;
    wiki?: string | undefined;
};

export type CircuitDetailsProps = {
    [key: string]: CircuitProps;
};
export type ContinentProps = {
    [key: string]: {
        center: [LngLatLike, LngLatLike]; // ? just remember kids! mapbox is [lng, lat] and not [lat, lng]
        zoom: number;
    };
};

export type CircuitLabelProps = {
    circuitsData: CircuitProps[] | undefined;
    id: string;
    map: Map | undefined;
    newBBox: number[];
    originalLabel: string;
    setDropdownLabel: (label: string) => void;
};

export interface FlyToPOIProps {
    circuitsData: CircuitProps[] | undefined;
    circuit: CircuitProps;
    map: Map | undefined;
    setDropdownLabel: (label: string) => void;
    setSelectedCircuit: (circuit: CircuitProps | undefined) => void;
}

export interface FlyToProps {
    position: LngLatLike;
    continent: string;
    map: Map | undefined;
    setSelectedCircuit: (circuit: CircuitProps | undefined) => void;
}

export interface GotoCircuitProps {
    circuitId: string;
    map: Map | undefined;
    setCircuit?: (circuit: CircuitProps) => void;
    setContinent?: (continent: string) => void;
}

export interface GotoContinentProps {
    c: string;
    map: Map | undefined;
    setC: (circuit: CircuitProps | undefined) => void;
    setCon: (continent: string) => void;
}

export interface LoadCircuitLayersProps {
    data: CircuitDetailsProps;
    map: Map | undefined;
}

export interface ZoomToProps {
    position: LngLatLike;
    continent: string;
    map: Map | undefined;
    zoomLevel?: number;
}

export interface CreateMarkerProps {
    circuit: CircuitProps;
    map: Map | undefined;
    mapboxgl: typeof mapboxgl | mapboxgl;
}
