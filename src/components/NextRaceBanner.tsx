import { RootState, useAppSelector } from 'app/store';
// import { DateTime } from 'luxon';
import { JSX } from 'react';
// import CountdownClock from './CountdownClock';

/**
 * Component to display the next race banner.
 *
 * @component
 * @returns {JSX.Element} A JSX element displaying the next race information or an empty fragment if no race details are provided.
 */
const NextRaceBanner: React.FC = (): JSX.Element => {
    const raceNext = useAppSelector((state: RootState) => state.races.raceNext);

    return (
        <div
            className="
            raceNext
            krona-one-regular
            xl:text-2xl
            lg:text-2xl
            text-xl
            pb-2
            pt-2
            w-full
            italic
        "
        >
            {`Next Race: ${raceNext?.date || ''} @ ${raceNext?.circuit_name || 'N/A'}`}
        </div>
    );
};

export default NextRaceBanner;
