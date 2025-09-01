import { cn } from 'lib/utils';
import {
    Card as CardComponent,
    CardContent as CardComponentContent,
    CardDescription as CardComponentDescription,
    CardFooter as CardComponentFooter,
    CardHeader as CardComponentHeader,
    CardTitle as CardComponentTitle,
} from './ui/card';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <CardComponent
            className={cn('overflow-y-scroll overflow-x-hidden p-2 m-0 custom-scrollbar', className)}
            {...props}
        />
    );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
    return <CardComponentContent className={cn('text-sm text-right m-0 p-0', className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
    return <CardComponentDescription className={cn('', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return <CardComponentFooter className={cn('p-0 m-0 pt-4', className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return <CardComponentHeader className={cn('p-0 m-0 pt-4', className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <CardComponentTitle
            className={cn(
                'h-8 bg-zinc-900 pl-4',
                'w-full overflow-hidden text-ellipsis whitespace-nowrap block ml-0 text-left font-bold krona-one-regular',
                className,
            )}
            {...props}
        />
    );
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
