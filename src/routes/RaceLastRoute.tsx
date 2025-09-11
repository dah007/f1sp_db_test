import { RootState, useAppDispatch, useAppSelector } from '@/app/store';
import RaceDetailHeader from '@/components/Race/RaceDetailHeader';
import { useGetLastRaceResultsQuery, useGetRaceWithGPQuery } from '@/features/raceApi';
import { setLastRaceResults, setRaceWGP } from '@/slices/racesSlice';
import { setError, setLoading } from '@/slices/systemWideSlice';
import type { RaceProps, RaceResultProps } from '@/types/races';
import { useEffect } from 'react';

const RaceLastRoute = () => {
    const dispatch = useAppDispatch();

    // Only used here, to get the last race id
    const nextRace = useAppSelector((state: RootState) => state.races.raceNext) as RaceResultProps | null;
    const raceWGP = useAppSelector((state: RootState) => state.races.raceWGP) as RaceProps | null;

    const {
        data: raceWGPData,
        isLoading: raceWGPisLoading,
        isError: raceWGPisError,
    } = useGetRaceWithGPQuery(parseInt(nextRace?.id as unknown as string, 10) || 0) as {
        data: Partial<RaceProps> | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    useEffect(() => {
        if (raceWGPisError) {
            dispatch(setError(true));
            return;
        }
        if (raceWGPisLoading) dispatch(setLoading(true));
        if (!raceWGPData) return;
        dispatch(setRaceWGP(raceWGPData));
        dispatch(setLoading(false));
    }, [raceWGPData, raceWGPisError, raceWGPisLoading, dispatch]);

    const {
        data: dataResults,
        isLoading: dataIsLoading,
        isError: dataIsError,
    } = useGetLastRaceResultsQuery(parseInt(nextRace?.id as unknown as string, 10) || 0) as {
        data: RaceResultProps[] | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    useEffect(() => {
        if (dataIsError) {
            dispatch(setError(true));
            return;
        }
        if (dataIsLoading) dispatch(setLoading(true));
        if (!dataResults) return;
        dispatch(setLastRaceResults(dataResults));
        dispatch(setLoading(false));
    }, [dataResults, dataIsError, dataIsLoading, dispatch]);

    if (!raceWGP) return <></>;

    return (
        <>
            <div className="flex flex-col justify-between items-center m-0 p-0 pb-8 bg-zinc-800 border-b border-zinc-700">
                <RaceDetailHeader race={raceWGP as unknown as RaceProps} />
            </div>

            <div className="w-full border-t-1 border-zinc-700 dark:border-zinc-500 mt-4 pt-4">
                <h2 className="text-xl font-bold mb-2 krona-one-regular">Previous Results</h2>

                {JSON.stringify(dataResults)}

                {/* <PreviousResultsTable circuitId={dataResults ? dataResults[0].circuit_id : ''} /> */}
            </div>
        </>
    );
};
export default RaceLastRoute;
