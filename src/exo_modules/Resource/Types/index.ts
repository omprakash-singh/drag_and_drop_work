import { find } from "@execonline-inc/collections";
import { toResult } from "@execonline-inc/maybe-adapter";
import {
  Link as LinkR,
  Linkable as LinkableR,
  payload as payloadR,
  PossiblyLinkable as PossiblyLinkableR,
  Resource as ResourceR,
  resource as resourceR,
  ResourceWithErrors as ResourceWithErrorsR,
  ResourceWithMetadata as ResourceWithMetadataR,
} from "@execonline-inc/resource";
import { Maybe } from "maybeasy";
import { Result } from "resulty";

const rels = [
  "add-complete",
  "add-current",
  "add-progress-detail",
  "ancestor",
  "ancestor-1",
  "announcements",
  "asset",
  "assignments",
  "attachment",
  "asset-usages",
  "bluejeans",
  "bulk-update-team-message",
  "catalog-listings",
  "coaching-products",
  "communications",
  "communications-template",
  "copy",
  "copy-form",
  "conference-room",
  "create",
  "create-form",
  "deactivate",
  "delete",
  "destroy",
  "download",
  "example-metadata",
  "example-translation",
  "edit",
  "edit-content",
  "edit-form",
  "edit-publish-settings",
  "edit-schedule",
  "engagement",
  "engagement-activities",
  "files",
  "history",
  "impersonate",
  "import",
  "import-errors",
  "import-items",
  "import-translations",
  "index",
  "last-published-by",
  "logs",
  "meta",
  "new",
  "next",
  "options",
  "organization-template",
  "origin-program",
  "override-template",
  "page-template",
  "parent",
  "parent-program",
  "preview",
  "previous",
  "products",
  "program-families",
  "programs",
  "progress",
  "publish",
  "reactivate",
  "recipients-template",
  "recommendation-engines",
  "registrants",
  "remove",
  "remove-communication",
  "remove-complete",
  "salesforce",
  "scopeable",
  "self",
  "share-urls",
  "shareFile",
  "shared-open-enrollment",
  "shared-open-enrollment-short-link",
  "thumb",
  "update",
  "update-override-template",
  "use-case",
  "use-case-registrant-options-template",
  "use-case-registrant-template",
  "use-case-roster",
  "user",
  "view",
  "view-all",
  "visualization-token",
] as const;

export type Rel = typeof rels[number];

export const toRel = (value: string): Result<string, Rel> =>
  toResult(
    `Expected to find an HTTP rel string. Instead I found ${value}`,
    find((rel) => rel === value, rels)
  );

export type Link = LinkR<Rel>;
export type Linkable = LinkableR<Rel>;
export type PossiblyLinkable = PossiblyLinkableR<Rel>;

export type Resource<T> = ResourceR<T, Rel>;
export type ResourceWithErrors<T> = ResourceWithErrorsR<T, Rel>;
export type ResourceWithMetadata<T, M> = ResourceWithMetadataR<T, M, Rel>;
export type ResourceWithActions<T, A> = Resource<T> & { actions: A };

export const resource: <T>(
  links: ReadonlyArray<Link>,
  payload: T
) => Resource<T> = resourceR;

export const payload: <A, R extends Resource<A>>(r: R) => A = payloadR;

// TODO: which of this need to stay, and which are in the lib now?
export const hasUrl =
  <T>(url: string, rel: Rel) =>
  (r: Resource<T>): boolean => {
    return r.links.reduce<boolean>(
      (found, l) => (found ? found : l.href === url && l.rel === rel),
      false
    );
  };

export type ValidationErrors = ValidationError[];

export interface ValidationError {
  kind: "validation-error";
  title: "Invalid Attribute";
  resource: string;
  attributePath: string;
  attribute: string;
  detail: string;
  error: string;
}

export type Embedded<T> = {
  [K in Rel & keyof T]: Maybe<Resource<T[K]>>;
};

export type ResourceWithEmbedded<T, E> = Resource<T> & {
  embedded: Embedded<E>;
};
