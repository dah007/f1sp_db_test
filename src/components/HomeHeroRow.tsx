import { RootState, useAppSelector } from '@/app/store';
import { RaceProps, RaceResultProps } from '@/types/races';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './CardContainer';
import { Skeleton } from './ui/skeleton';

import { DriverStanding } from '@/types/standings';
import { formatDate } from '@/utils/date';
import { intlNumberFormat } from '@/utils/number';
import { useMemo } from 'react';

interface ConstructorStanding {
    short_name: string;
    points: number;
}

interface DriverOfTheDayData {
    name: string;
}

const HomeHeroRow = () => {
    const constructorsStanding: ConstructorStanding[] = useAppSelector(
        (state: RootState) => state.standings.constructors || [],
    );
    const driverStandings = useAppSelector((state: RootState) => state.standings.drivers || []);

    const raceNext: RaceResultProps | null = useAppSelector(
        (state: RootState) => state.races.raceNext,
    ) as RaceResultProps | null;
    const raceResults: RaceResultProps[] = useAppSelector((state: RootState) => state.races.lastRaceResults) ?? [];
    const raceWGP: Partial<RaceProps> | null = useAppSelector(
        (state: RootState) => state.races.raceWGP,
    ) as Partial<RaceProps> | null;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const driverOfTheDay: DriverOfTheDayData[] =
        useAppSelector((state: RootState) => state.drivers.driversOfTheDay) || [];

    const driverOfTheDayElement = useMemo((): JSX.Element => {
        if (driverOfTheDay && driverOfTheDay.length > 0 && driverOfTheDay[0]?.name) {
            return (
                <>
                    <span className="font-bold">Driver of the day:</span> {driverOfTheDay[0].name}
                </>
            );
        }

        return <Skeleton className="h-[20px] w-[100px] rounded-full bg-white" />;
    }, [driverOfTheDay]);

    const constructorLeader = useMemo((): ConstructorStanding | null => {
        if (!constructorsStanding?.length) return null;

        const leader: ConstructorStanding = constructorsStanding.reduce(
            (prev: ConstructorStanding, current: ConstructorStanding) => {
                return (prev?.points ?? 0) > (current?.points ?? 0) ? prev : current;
            },
        );
        return leader;
    }, [constructorsStanding]);

    const driverLeader = useMemo((): DriverStanding | null => {
        if (!driverStandings?.length) return null;

        const leader: DriverStanding = driverStandings.reduce((prev: DriverStanding, current: DriverStanding) => {
            return (prev?.points ?? 0) > (current?.points ?? 0) ? prev : current;
        });
        return leader;
    }, [driverStandings]);

    return (
        <div
            className="
                grid 
                lg:grid-cols-4 
                lg:grid-rows-1
                md:grid-cols-2
                md:grid-rows-2
                sm:grid-cols-1
                sm:grid-rows-4
                grid-col-1 
                grid-rows-4 gap-4 pb-4 sm:pb-0 p-0 sm:p-6"
        >
            <Card className="w-full overflow-hidden">
                <CardHeader>
                    <CardTitle>Next: {raceNext?.circuit_name ?? 'TBD'}</CardTitle>
                    <CardDescription>
                        {raceNext?.date_time ? formatDate(raceNext.date_time as unknown as string) : 'Date TBD'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-nowrap flex-col text-right">
                        <div>
                            <span className="font-bold">Length: </span>
                            {intlNumberFormat(raceNext?.course_length ?? 0)} km
                        </div>
                        <div>
                            <span className="font-bold">Turns: </span>
                            {intlNumberFormat(raceNext?.turns ?? 0)}
                        </div>
                        <div>
                            <span className="font-bold">Total distance: </span>
                            {intlNumberFormat(raceNext?.distance ?? 0)} km
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full overflow-hidden">
                <CardHeader>
                    <CardTitle>Last Race</CardTitle>
                    <CardDescription>{raceWGP ? raceWGP.short_name : 'N/A'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-nowrap flex-col text-right">
                        <div>
                            <span className="font-bold">Winner: </span>
                            {raceResults?.length > 0 ? raceResults[0]?.driver_name ?? 'N/A' : 'N/A'}
                        </div>
                        <div>{driverOfTheDayElement}</div>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full overflow-hidden">
                <CardHeader>
                    <CardTitle className="overflow-wrap">Championship Leader</CardTitle>
                    <CardDescription>As of {formatDate(new Date())}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-nowrap flex-col text-right">
                        <div>
                            <span className="font-bold">Name: </span>
                            {driverLeader?.name ?? 'N/A'}
                        </div>
                        <div>
                            <span className="font-bold">Points: </span>
                            {driverLeader?.points ?? 0}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full overflow-hidden">
                <CardHeader>
                    <CardTitle>Constructor Leader</CardTitle>
                    <CardDescription>As of {formatDate(new Date())}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-nowrap flex-col text-right">
                        <div>
                            <span className="font-bold">Team: </span>
                            {constructorLeader?.short_name ?? 'N/A'}
                        </div>
                        <div>
                            <span className="font-bold">Points: </span>
                            {constructorLeader?.points ?? 0}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default HomeHeroRow;
