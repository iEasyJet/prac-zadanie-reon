import { TMetadata } from './metadata/metadata.type';

export type TCatalogElement = {
    id: number;
    metadata: TMetadata;
    quantity: number;
    catalog_id: number;
    price_id: number;
};
