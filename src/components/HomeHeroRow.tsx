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
    const driverStandings = useAppSelector((state: RootState) => state.standings.drivers);

    const raceNext: RaceResultProps | null = useAppSelector(
        (state: RootState) => state.races.raceNext,
    ) as RaceResultProps | null;
    const raceResults: RaceResultProps[] = useAppSelector((state: RootState) => state.races.lastRaceResults) ?? [];
    const raceWGP: Partial<RaceProps> | null = useAppSelector(
        (state: RootState) => state.races.raceWGP,
    ) as Partial<RaceProps> | null;

    const driverOfTheDay: DriverOfTheDayData[] =
        useAppSelector((state: RootState) => state.drivers.driversOfTheDay) || [];

    const DriverOfTheDay = (): JSX.Element => {
        if (driverOfTheDay && driverOfTheDay.length > 0) {
            return (
                <>
                    <span className="font-bold">Driver of the day:</span> {driverOfTheDay[0].name}
                </>
            );
        }

        return <Skeleton className="h-[20px] w-[100px] rounded-full bg-white" />;
    };
    const constructorLeader = useMemo((): ConstructorStanding | null => {
        // sort of constructors standings return the record with the highest points
        if (constructorsStanding && constructorsStanding.length > 0) {
            const leader: ConstructorStanding = constructorsStanding.reduce(
                (prev: ConstructorStanding, current: ConstructorStanding) => {
                    return prev.points > current.points ? prev : current;
                },
            );
            return leader;
        }

        return null;
    }, [constructorsStanding]);

    const driverLeader = useMemo((): DriverStanding | null => {
        // sort of driver standings return the record with the highest points
        if (driverStandings && driverStandings.length > 0) {
            const leader: DriverStanding = driverStandings.reduce((prev: DriverStanding, current: DriverStanding) => {
                return prev.points > current.points ? prev : current;
            });
            return leader;
        }

        return null;
    }, [driverStandings]);

    return (
        <div
            className="
                grid 
                lg:grid-cols-4 
                lg:grid-rows-1
                md:grid-cols-2
                md:grid-rows-2
                sm:grid-col-1
                sm:grid-rows-4
                grid-col-1 
                grid-rows-4 gap-4 pb-4"
        >
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Next: {raceNext?.circuit_name}</CardTitle>
                    <CardDescription>Date: {formatDate(raceNext?.date_time as unknown as string)}</CardDescription>
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

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Last Race</CardTitle>
                    <CardDescription>{raceWGP ? raceWGP.official_name : 'N/A'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-nowrap flex-col text-right">
                        <div>
                            <span className="font-bold">Winner: </span>
                            {raceResults.length > 0 ? raceResults[0].driver_name : 'N/A'}
                        </div>
                        <div>
                            <DriverOfTheDay />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Championship Leader</CardTitle>
                    <CardDescription>As of {formatDate(new Date())}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-nowrap flex-col text-right">
                        <div>
                            <span className="font-bold">Name: </span>
                            {driverLeader?.name || 'N/A'}
                        </div>
                        <div>
                            <span className="font-bold">Points: </span>
                            {driverLeader?.points || 0}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Constructor Leader</CardTitle>
                    <CardDescription>As of {formatDate(new Date())}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-nowrap flex-col text-right">
                        <div>
                            <span className="font-bold">Team: </span>
                            {constructorLeader?.short_name || 'N/A'}
                        </div>
                        <div>
                            <span className="font-bold">Points: </span>
                            {constructorLeader?.points || 0}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default HomeHeroRow;
