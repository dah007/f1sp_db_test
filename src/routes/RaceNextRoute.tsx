import { useAppSelector } from 'app/store';
// import { useState } from 'react';

import PreviousResultsTable from 'components/Race/PreviousResultsTable';
import RaceDetailHeader from 'components/Race/RaceDetailHeader';

import { CIRCUIT_DETAILS } from 'constants/circuitConstants';

const RaceNextRoute = () => {
    const raceNext = useAppSelector((state) => state.races.raceNext);

    // const [openedAccordion, setOpenedAccordion] = useState<string | null>(null);

    const circuitId = raceNext?.circuit_id || '';
    if (!raceNext) return <></>;

    const circuitDetails = CIRCUIT_DETAILS[raceNext.circuit_id as keyof typeof CIRCUIT_DETAILS];

    if (!circuitDetails) return <></>;

    return (
        <>
            <div className="flex flex-col justify-between items-center m-0 p-0 pb-8 border border-zinc-700 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-xl">
                <RaceDetailHeader race={raceNext} />

                {/* <div className="flex justify-evenly items-center gap-4 w-full p-4">
                    <div>
                        <div className="text-xl font-bold r-2 krona-one-regular">When?</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {raceNext.date} @ {raceNext.time || 'TBD'} local time
                        </div>

                        <div className="text-xl font-bold r-2 krona-one-regular">Where?</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {circuitDetails?.place_name || 'N/A'}
                        </div>

                        <div className="text-xl font-bold r-2 krona-one-regular">Round</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {raceNext.round || '-'} of {raceNext.total_races || '-'}
                        </div>

                        <div className="text-xl font-bold r-2 krona-one-regular">Circuit Length</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {(circuitDetails?.length ?? 1) / 1000 || 'TBD'} km
                        </div>

                        <div className="text-xl font-bold r-2 krona-one-regular">More Info</div>
                        <div className="pl-4">
                            {raceNext?.circuit_id &&
                                CIRCUIT_DETAILS[raceNext.circuit_id as keyof typeof CIRCUIT_DETAILS]?.wiki && (
                                    <a
                                        className="text-blue-500 hover:underline"
                                        href={
                                            CIRCUIT_DETAILS[raceNext.circuit_id as keyof typeof CIRCUIT_DETAILS].wiki ??
                                            ''
                                        }
                                        rel="noreferrer"
                                        target="_blank"
                                    >
                                        WiKi
                                    </a>
                                )}
                        </div>
                    </div>

                    <div>
                        <img
                            className="max-w-[300px]"
                            alt={raceNext.official_name || raceNext.circuit_id}
                            src={`/assets/tracks/${raceNext.circuit_id}.png`}
                        />
                    </div>
                </div> */}
            </div>
            {/* ? END HEADER! */}

            <div className="w-full dark:border-zinc-500 pt-4">
                <h2 className="text-xl font-bold mb-2 krona-one-regular">Previous Results</h2>

                <PreviousResultsTable circuitId={circuitId} />
            </div>
        </>
    );
};

export default RaceNextRoute;
