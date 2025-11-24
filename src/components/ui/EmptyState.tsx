import * as React from "react";
import {
	Empty,
	EmptyHeader,
	EmptyTitle,
	EmptyDescription,
	EmptyContent,
	EmptyMedia,
} from "./Empty";
import { cn } from "@/lib/utils";

export type EmptyStateProps = {
	title?: React.ReactNode;
	description?: React.ReactNode;
	media?: React.ReactNode; // icon/image/node
	mediaVariant?: "default" | "icon";
	actions?: React.ReactNode; // buttons/links
	className?: string;
	headerClassName?: string;
	mediaClassName?: string;
	titleClassName?: string;
	descriptionClassName?: string;
	contentClassName?: string;
	children?: React.ReactNode; // extra content below description
};

/**
 * EmptyState – Composes the Empty primitives into a convenient, reusable pattern.
 *
 * Example:
 * <EmptyState
 *   media={<IconInbox />}
 *   mediaVariant="icon"
 *   title="Nothing here yet"
 *   description={<>Try adjusting your filters or <a href="/explore">browse all</a>.</>}
 *   actions={<Button>Refresh</Button>}
 * />
 */
export function EmptyState({
	title,
	description,
	media,
	mediaVariant = "default",
	actions,
	className,
	headerClassName,
	mediaClassName,
	titleClassName,
	descriptionClassName,
	contentClassName,
	children,
}: EmptyStateProps): JSX.Element {
	return (
		<Empty className={cn("", className)}>
			<EmptyHeader className={headerClassName}>
				{media ? (
					<EmptyMedia variant={mediaVariant} className={mediaClassName}>
						{media}
					</EmptyMedia>
				) : null}

				{title ? <EmptyTitle className={titleClassName}>{title}</EmptyTitle> : null}

				{description ? (
					<EmptyDescription className={descriptionClassName}>
						{description}
					</EmptyDescription>
				) : null}
			</EmptyHeader>

			{actions || children ? (
				<EmptyContent className={contentClassName}>
					{children}
					{actions}
				</EmptyContent>
			) : null}
		</Empty>
	);
}

export default EmptyState;

