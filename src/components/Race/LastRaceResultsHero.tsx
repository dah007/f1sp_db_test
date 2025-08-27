import { RootState, useAppSelector } from '@/app/store';
import { RaceProps } from '@/types/races';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../CardContainer';
import { Skeleton } from '../ui/skeleton';

const LastRaceResultsHero: React.FC = () => {
    const driverOfTheDay = useAppSelector((state: RootState) => state.drivers.driversOfTheDay) || [];
    const raceWGP = useAppSelector((state: RootState) => state.races.raceWGP) as Partial<RaceProps> | null;

    const DriverOfTheDay = () => {
        if (driverOfTheDay && driverOfTheDay.length > 0) {
            return <>Driver of the day: {driverOfTheDay[0].name}</>;
        }

        return <Skeleton className="h-[20px] w-[100px] rounded-full bg-white" />;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Last Race</CardTitle>
                <CardDescription>{raceWGP ? raceWGP.official_name : 'N/A'}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-nowrap flex-col text-right">
                    <div>
                        <span className="font-bold">Winner: </span>
                        Mr. Smith
                    </div>
                    <div>
                        <DriverOfTheDay />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LastRaceResultsHero;
