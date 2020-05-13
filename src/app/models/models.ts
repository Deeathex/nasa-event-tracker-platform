export enum EventStatus {
  open = 'open',
  closed = 'closed',
  all = 'all'
}

export interface Category {
  id: string;
  title: string;
  description?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  link?: string;
  categories?: Category[];
  sources?: Source[];
  geometries?: Geometry[];
  closed?: string;
}

export interface Source {
  id: string;
  title?: string;
  url?: string;
}

export interface Geometry {
  id: string;
  date?: Date;
  coordinates?: Coordinates;
}

export interface Coordinates {
  latitude?: number;
  longitude?: number;
}
