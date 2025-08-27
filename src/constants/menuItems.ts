import { YEAR } from '@/constants/constants';

export const constructorMenuItems: { title: string; href: string; description: string }[] = [
    {
        title: 'Standings',
        href: `/standings`,
        description: "View the current season's standings.",
    },
    {
        title: 'All Constructors',
        href: `/constructors/${YEAR}`,
        description: "View the current season's constructors.",
    },
    {
        title: 'Constructor Records',
        href: '/constructor/records',
        description: 'View constructor records and statistics (coming soon).',
    },
    {
        title: 'Engine Manufacturers',
        href: '/extra/engine',
        description: 'View engine records and statistics',
    },
    {
        title: 'Tire Suppliers',
        href: '/extra/tyre',
        description: 'View tire records and statistics',
    },
    {
        title: 'Chassis Manufacturers',
        href: '/extra/chassis',
        description: 'View chassis records and statistics (coming soon).',
    },
];

export const driverMenuItems: { title: string; href: string; description: string }[] = [
    {
        title: 'Standings',
        href: `/standings`,
        description: "View the current season's standings.",
    },
    {
        title: 'Current Drivers',
        href: `/drivers`,
        description: "This is currently the same page as Previous Drivers 😟.View the current season's drivers. ",
    },
    {
        title: 'Previous Drivers',
        href: '/drivers',
        description: "View the previous season's drivers.",
    },
    {
        title: 'Driver Records',
        href: '/driver/records',
        description: 'View driver records and statistics (coming soon).',
    },
    {
        title: 'Most Points w/o a Win',
        href: '/extra?tab=points',
        description: 'Top 100 drivers with the most points without a win.',
    },
];

export const raceMenuItems: { title: string; href: string; description: string }[] = [
    {
        title: 'Next Race',
        href: `/race/1138`,
        description: 'View details about the next race.',
    },
    {
        title: 'Last Race',
        href: `/race/last`,
        description: 'View details about the last race.',
    },
    {
        title: 'Current Season',
        href: `/races`,
        description: "View the current season's races. New current season interface coming some.",
    },
    {
        title: 'Circuits',
        href: `/circuits`,
        description: "View the current season's circuits.",
    },
    {
        title: 'All Races',
        href: '/races',
        description:
            'Changing to a season by season view soon. Table of results, single table view for a given season with filtering.',
    },
    {
        title: 'Records',
        href: '/races/records',
        description: 'View race records and statistics. (coming soon)',
    },
];

export const seasonsMenuItems: { title: string; href: string; description: string }[] = [
    {
        title: 'Current Season',
        href: `/seasons/season/2025`,
        description: 'View current season and their details.',
    },
    {
        title: 'All Seasons',
        href: `/seasons`,
        description: 'View all seasons at the top level with the ability to  and their details.',
    },
    {
        title: 'Season Records',
        href: '/seasons/records',
        description: 'View season records and statistics (coming soon).',
    },
];
