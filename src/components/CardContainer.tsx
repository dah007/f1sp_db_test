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
    return <CardComponent className={cn('w-1/4 mb-4 p-2', className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
    return <CardComponentContent className={cn('text-sm text-right m-0 p-0', className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
    return <CardComponentDescription className={cn('text-right', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return <CardComponentFooter className={cn('p-0 m-0 pt-4', className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return <CardComponentHeader className={cn('p-0 m-0 pt-4', className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <CardComponentTitle className={cn('pl-0 ml-0 text-left font-bold krona-one-regular', className)} {...props} />
    );
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
