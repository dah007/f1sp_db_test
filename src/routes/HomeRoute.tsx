'use client';

import { cn } from 'lib/utils';
import { JSX, useEffect } from 'react';

import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import type { DriverOfTheDayProps } from 'types/drivers';
import type { RaceProps, RaceResultProps } from 'types/races';
import type { ConstructorStanding, DriverStanding } from 'types/standings';

import { useGetDriverOfTheDayQuery } from 'features/driversApi';
import { useGetLastRaceResultsQuery, useGetRaceWithGPQuery } from 'features/raceApi';
import { useGetConstructorStandingsQuery, useGetDriverStandingsQuery } from 'features/standingsApi';
import { selectError } from 'selectors/systemWideSelector';
import { setDriversOfTheDay } from 'slices/driversSlice';
import { setLastRaceResults, setRaceWGP } from 'slices/racesSlice';
import { setConstructorStandings, setDriverStandings } from 'slices/standingsSlice';
import { setError, setLoading } from 'slices/systemWideSlice';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from 'components/CardContainer';
import ConstructorStandings from 'components/ConstructorsStandingsTable';
import DriverStandingsChart from 'components/DriverStandingsChart';
import ErrorDialog from 'components/ErrorDialog';
import HomeHeroRow from 'components/HomeHeroRow';
import LastRaceResultsPod from 'components/LastRaceResultsPod';
import TotalWinsPerYear from 'components/TotalWinsPerYear';
import { Alert, AlertDescription, AlertTitle } from 'components/ui/alert';

import { InfoIcon } from 'lucide-react';

import { YEAR } from 'constants/constants';

interface MessageFromURLResult {
    success: string | null;
    error: string | null;
    message: string | null;
}

const getMessageFromURL: () => MessageFromURLResult = () => {
    const urlParams = new URLSearchParams(window.location.search);

    return {
        success: urlParams.get('success'),
        error: urlParams.get('error'),
        message: urlParams.get('message'),
    };
};

const Home: React.FC = () => {
    const dispatch = useAppDispatch();

    const isLoading = useAppSelector((state: RootState) => state.systemWide.loading);
    const raceNext = useAppSelector((state: RootState) => state.races.raceNext) as RaceResultProps | null;
    const raceWGP = useAppSelector((state: RootState) => state.races.raceWGP) as Partial<RaceProps> | null;
    const systemError = useAppSelector((state: RootState) => selectError(state));

    const { data: constructorsData } = useGetConstructorStandingsQuery(YEAR) as {
        data: ConstructorStanding[] | undefined;
    };

    useEffect(() => {
        if (!constructorsData) return;
        dispatch(setConstructorStandings(constructorsData));
    }, [dispatch, constructorsData]);

    const {
        data: dataDriversOfTheDay,
        isError: driverOfTheDayError,
        isLoading: driverOfTheDayLoading,
    } = useGetDriverOfTheDayQuery(parseInt(raceNext?.id as unknown as string, 10) - 1 || 0) as {
        data: DriverOfTheDayProps[];
        isError: boolean;
        isLoading: boolean;
    };

    useEffect(() => {
        if (driverOfTheDayError) dispatch(setError(true));
        if (driverOfTheDayLoading) dispatch(setLoading(true));
        if (!dataDriversOfTheDay) return;
        dispatch(setDriversOfTheDay(dataDriversOfTheDay));
        dispatch(setLoading(false));
    }, [dispatch, dataDriversOfTheDay, driverOfTheDayError, driverOfTheDayLoading]);

    const {
        data: raceWGPData,
        isLoading: raceWGPisLoading,
        isError: raceWGPisError,
    } = useGetRaceWithGPQuery(parseInt(raceNext?.id as unknown as string, 10) - 1 || 0) as {
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
    } = useGetLastRaceResultsQuery(parseInt(raceNext?.id as unknown as string, 10) - 1 || 0) as {
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

    const {
        data: driverStandingsData,
        isError: driverStandingsIsError,
        isLoading: driverStandingsIsLoading,
    } = useGetDriverStandingsQuery(YEAR) as {
        data: DriverStanding[] | undefined;
        isLoading?: boolean;
        isError: boolean;
    };

    useEffect(() => {
        if (driverStandingsIsLoading) dispatch(setLoading(true));

        if (driverStandingsIsError) {
            dispatch(setError(true));
            return;
        }
        if (!driverStandingsData) return;
        dispatch(setDriverStandings(driverStandingsData));
    }, [driverStandingsData, driverStandingsIsError, driverStandingsIsLoading, dispatch]);

    const { success: voteSuccessful, message: voteMessage } = getMessageFromURL();

    /**
     * Alert message box with a title, optional description, and optional children.
     *
     * @component
     * @param {Object} props - The properties that define the MessageBox.
     * @param {string} props.title - The title of the message box.
     * @param {string} [props.description] - Optional description text for the message box.
     * @param {string} [props.className] - Optional CSS class name to apply additional styling.
     * @param {React.ReactNode} [props.children] - Optional children elements to render inside the message box.
     * @returns {JSX.Element} A styled alert component with the provided content.
     */
    const MessageBox = ({
        title,
        description,
        className,
        children,
    }: {
        title: string;
        description?: string;
        className?: string;
        children?: React.ReactNode;
    }): JSX.Element => {
        return (
            <Alert className={cn('flex flex-col items-start justify-start', className)}>
                <div className="flex w-full gap-4">
                    <InfoIcon color="green" className="h-8 w-8" />
                    <AlertTitle className="text-xl text-center font-bold krona-one-regular">{title}</AlertTitle>
                </div>

                <AlertDescription>{description}</AlertDescription>
                {children}
            </Alert>
        );
    };

    return (
        <>
            {isLoading && <div>Loading...</div>}

            {voteSuccessful && (
                <MessageBox title="Vote">
                    <p className="text-xl text-center ">{voteMessage}</p>
                </MessageBox>
            )}

            {systemError && <ErrorDialog />}

            <HomeHeroRow />

            <div className="flex flex-col justify-center items-center p-0 sm:p-6">
                <div
                    className="
                lg:grid
                lg:grid-cols-2
                lg:grid-rows-2

                md:flex
                md:flex-col

                sm:flex
                sm:flex-col
                gap-4
                flex
                flex-col
                w-full"
                >
                    <Card
                        className={cn('overflow-y-scroll overflow-x-hidden w-full p-0 m-0 h-[30vh] custom-scrollbar')}
                    >
                        <CardHeader className="sticky bg-zinc-900 top-0 left-0 z-20">
                            <CardTitle className={cn('h-8 bg-zinc-900 pl-4')}>
                                {raceWGP ? raceWGP.official_name : 'N/A'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className={'z-10'}>
                            <LastRaceResultsPod />
                        </CardContent>
                    </Card>

                    <Card
                        className={cn('overflow-y-scroll overflow-x-hidden w-full p-0 m-0 h-[30vh] custom-scrollbar')}
                    >
                        <CardHeader className="sticky bg-zinc-900 top-0 left-0 z-20">
                            <CardTitle className={cn('h-8 bg-zinc-900 pl-4')}>
                                {raceWGP ? raceWGP.official_name : 'N/A'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className={'z-10'}>
                            <ConstructorStandings />
                        </CardContent>
                    </Card>

                    <Card
                        className={cn(
                            'overflow-y-scroll overflow-x-hidden w-full p-0 m-0 h-[30vh] custom-scrollbar col-2 row-2',
                        )}
                    >
                        <CardHeader className="sticky bg-zinc-900 top-0 left-0">
                            <CardTitle className={cn('h-8 bg-zinc-900 pl-4')}>Wins This Season</CardTitle>
                        </CardHeader>
                        <CardContent className={cn('z-10')}>
                            <TotalWinsPerYear />
                        </CardContent>
                    </Card>

                    <Card
                        className={cn(
                            'overflow-y-scroll overflow-x-hidden w-full p-0 m-0 h-[30vh] custom-scrollbar col-2 row-1',
                        )}
                    >
                        <CardHeader className="sticky bg-zinc-900 top-0 left-0">
                            <CardTitle className={cn('h-8 bg-zinc-900 pl-4')}>Driver Standings</CardTitle>
                        </CardHeader>
                        <CardContent className={cn('z-10 pl-4 pr-4')}>
                            <DriverStandingsChart />
                        </CardContent>
                        <CardFooter className="w-full text-left pl-4">
                            <button
                                rel="link"
                                onClick={() => (location.href = '/standings')}
                                className="text-blue-500 hover:text-blue-700 cursor-pointer font-semibold text-sm"
                            >
                                View Full Standings
                            </button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Home;
