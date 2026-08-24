/**
 * Déclarations TypeScript globales pour Google Publisher Tag (GPT) Web Rewarded Ads
 */

declare global {
  interface Window {
    googletag: googletag.Googletag;
  }
}

export namespace googletag {
  export interface Googletag {
    cmd: Array<() => void>;
    apiReady?: boolean;
    defineOutOfPageSlot: (
      adUnitPath: string,
      format: OutOfPageFormat
    ) => Slot | null;
    display: (slotOrElementId: Slot | string) => void;
    destroySlots: (slots?: Slot[]) => boolean;
    enableServices: () => void;
    pubads: () => PublisherAdsService;
    enums: {
      OutOfPageFormat: {
        REWARDED: OutOfPageFormat;
      };
    };
  }

  export type OutOfPageFormat = number;

  export interface Slot {
    addService: (service: Service) => Slot;
    getAdUnitPath: () => string;
  }

  export interface Service {}

  export interface PublisherAdsService extends Service {
    addEventListener: (
      eventType: string,
      listener: (event: any) => void
    ) => PublisherAdsService;
    removeEventListener: (
      eventType: string,
      listener: (event: any) => void
    ) => PublisherAdsService;
    enableSingleRequest: () => boolean;
  }

  export interface RewardedPayload {
    amount: number;
    type: string;
  }

  export interface RewardedSlotGrantedEvent {
    slot: Slot;
    payload: RewardedPayload | null;
  }

  export interface RewardedSlotReadyEvent {
    slot: Slot;
    makeRewardedVisible: () => void;
  }

  export interface RewardedSlotClosedEvent {
    slot: Slot;
  }
}

export {};
