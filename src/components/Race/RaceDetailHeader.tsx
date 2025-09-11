import { CIRCUIT_DETAILS } from '@/constants/circuitConstants';
import { RaceProps } from '@/types/races';

const RaceDetailHeader: React.FC<{ race: Partial<RaceProps> }> = ({ race }): JSX.Element => {
    if (!race) return <></>;


    const circuitDetails = CIRCUIT_DETAILS[race.circuit_id as keyof typeof CIRCUIT_DETAILS];

    console.log('circuitDetails:', circuitDetails);

    return (
        <div className="flex flex-col justify-start items-start w-full m-0 p-4">
            <h1 className="text-2xl font-bold krona-one-regular text-amber-500 shadow-2xl">
                {circuitDetails.official_name || race.full_name || race.circuit_id}
            </h1>

            <div className="flex justify-evenly items-center gap-4 w-full p-4">
                <div>
                    <div className="text-xl font-bold r-2 krona-one-regular">When</div>
                    <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                        {new Date(`${race.date}T${race.time || '00:00:00'}Z`).toLocaleString('en-US', {
                            // timeZone: 'UTC',
                            dateStyle: 'medium',
                            timeStyle: 'short',
                        })}
                        <div className="text-sm text-zinc-500">
                            {new Date(`${race.date}T${race.time || '00:00:00'}Z`).toLocaleString('en-US', {
                                timeZone: 'UTC',
                                dateStyle: 'medium',
                                timeStyle: 'short',
                            })}{' '}
                            track time
                        </div>
                    </div>

                    <div className="text-xl font-bold r-2 krona-one-regular">Where</div>
                    <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                        {circuitDetails?.place_name || 'N/A'}
                        <div className="text-sm text-zinc-500">
                            {circuitDetails?.latitude && circuitDetails?.longitude && (
                                <a
                                    className="text-blue-500 hover:underline"
                                    href={`/circuits/${race.circuit_id ?? ''}`}
                                >
                                    {circuitDetails.latitude}, {circuitDetails.longitude}
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="text-xl font-bold r-2 krona-one-regular">Round</div>
                    <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                        {race.round || 'TBD'} of {race.total_rounds || 'TBD'}
                    </div>

                    <div className="text-xl font-bold r-2 krona-one-regular">Circuit Length</div>
                    <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                        {(circuitDetails?.length ?? 1) / 1000 || 'TBD'} km
                    </div>

                    <div className="text-xl font-bold r-2 krona-one-regular">More Info</div>
                    <div className="pl-4">
                        {race.circuit_id && CIRCUIT_DETAILS[race.circuit_id as keyof typeof CIRCUIT_DETAILS]?.wiki && (
                            <a
                                className="text-blue-500 hover:underline"
                                href={CIRCUIT_DETAILS[race.circuit_id as keyof typeof CIRCUIT_DETAILS].wiki ?? ''}
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
                        alt={race.official_name || race.circuit_id}
                        src={`/assets/tracks/${race.circuit_id}.png`}
                    />
                </div>
            </div>
        </div>
    );
};

export default RaceDetailHeader;
