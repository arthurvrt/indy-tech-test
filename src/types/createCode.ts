export interface DateRestriction {
  "@date": {
    after?: string;
    before?: string;
  };
}

export interface AgeRestriction {
  "@age": { eq?: number; lt?: number; gt?: number };
}

export interface WeatherRestriction {
  "@meteo": {
    is?: string;
    temp?: {
      gt?: number;
      lt?: number;
    };
  };
}

export interface OrRestriction {
  "@or": Restriction[];
}

export interface AndRestriction {
  "@and": Restriction[];
}

export type Restriction =
  | DateRestriction
  | AgeRestriction
  | WeatherRestriction
  | OrRestriction
  | AndRestriction;

export type Avantage = { percent: number };

export interface CodeCreation {
  name: string;
  avantage: Avantage;
  restrictions: Restriction[];
}
