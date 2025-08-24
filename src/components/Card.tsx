import { cn } from '@/lib/utils';

import {
    Card as CardComponent,
    CardContent as CardContentComponent,
    CardDescription as CardDescriptionComponent,
    CardFooter as CardFooterComponent,
    CardHeader as CardHeaderComponent,
    CardTitle as CardTitleComponent,
} from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';

interface CardProps {
    children: React.ReactNode;
    childrenClassName?: string;
    className?: string;
    description?: string;
    descriptionClassName?: string;
    footer?: React.ReactNode;
    footerClassName?: string;
    title?: string;
    titleClassName?: string;
}

/**
 * Renders a customizable card component with optional title, description, content, and footer.
 *
 * @remarks
 * This component uses UI primitives from the card library and supports custom styling via class names.
 *
 * @param props - The properties for the Card component.
 * @param props.children - The main content of the card.
 * @param props.childrenClassName - Optional class name for the children container.
 * @param props.className - Optional class name for the card container.
 * @param props.description - Optional description text displayed below the title.
 * @param props.descriptionClassName - Optional class name for the description.
 * @param props.footer - Optional footer content.
 * @param props.footerClassName - Optional class name for the footer.
 * @param props.title - Optional title text displayed at the top of the card.
 * @param props.titleClassName - Optional class name for the title.
 *
 * @returns The rendered Card component.
 */
const Card: React.FC<CardProps> = ({
    children,
    childrenClassName,
    className,
    description,
    descriptionClassName,
    footer,
    footerClassName,
    title,
    titleClassName,
}: CardProps): JSX.Element => {
    // const [notLoaded, setNotLoaded] = useState(true);
    return (
        <CardComponent
            className={cn(
                'text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm overflow-hidden bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700',
                className,
            )}
        >
            {(title || description) && (
                <CardHeaderComponent>
                    {title && <CardTitleComponent className={cn('m-0', titleClassName)}>{title}</CardTitleComponent>}
                    {description && (
                        <CardDescriptionComponent className={descriptionClassName}>
                            {description}
                        </CardDescriptionComponent>
                    )}
                </CardHeaderComponent>
            )}

            <CardContentComponent className={cn('children-div', childrenClassName)}>
                {!children && <Skeleton />}
                {children}
            </CardContentComponent>

            {footer && (
                <CardFooterComponent className={cn('card-footer flex justify-between', footerClassName)}>
                    {footer}
                </CardFooterComponent>
            )}
        </CardComponent>
    );
};

export default Card;
