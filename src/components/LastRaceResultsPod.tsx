import { RootState, useAppSelector } from 'app/store';
import { JSX } from 'react';
import type { RaceResultProps } from 'types/races';
import CardSkeleton from './CardSkeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

/**
 * Displays the results of Formula 1 race.
 *
 * This component fetches race results from the Redux store and displays them in a table format.
 * It shows driver positions, names, time gaps, and points earned. The component handles loading
 * states with a skeleton loader and empty data states with appropriate messaging.
 *
 * @returns A JSX element containing a table with race results or loading/empty states
 */
const LastRaceResultsPod: React.FC = (): JSX.Element => {
    const raceResults: RaceResultProps[] = useAppSelector((state: RootState) => state.races.lastRaceResults) ?? [];

    /**
     * Internal component that renders race results in table rows.
     *
     * @param props - Component props
     * @param props.raceResults - Array of race result data to display
     * @returns JSX elements representing table rows with race data, or null if invalid data
     */
    const RaceResults = ({ raceResults }: { raceResults: RaceResultProps[] }) => {
        // Check if raceResults is not an array and return null instead of a fragment with key
        if (!Array.isArray(raceResults)) return null;

        // Handle empty array case
        if (raceResults.length === 0) {
            return (
                <TableRow key="no-data">
                    <TableHead colSpan={5} className="text-center">
                        No data available
                    </TableHead>
                </TableRow>
            );
        }

        // Map through race results with proper keys
        return raceResults.map((race: RaceResultProps, index) => {
            const uniqueKey = `${index}-${race.permanent_number || index}`;

            return (
                <TableRow key={uniqueKey}>
                    <TableCell className="w-4 text-right">{race.position_text}</TableCell>
                    <TableCell className="text-left cursor-pointer text-bolder">{race.driver_name}</TableCell>
                    <TableCell className="w-2 text-right">{race.gap}</TableCell>
                    <TableCell className="w-2 text-right">{race.points}</TableCell>
                </TableRow>
            );
        });
    };

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            {!raceResults && <CardSkeleton />}

            <div className="flex-1">
                <Table className="w-full">
                    <TableHeader className="sticky top-0 z-10">
                        <TableRow>
                            <TableHead className="w-text-right">Pos</TableHead>
                            <TableHead>Driver</TableHead>
                            <TableHead className="text-right">Gap</TableHead>
                            <TableHead className="w-4 text-right">Points</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <RaceResults raceResults={raceResults} />
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default LastRaceResultsPod;
