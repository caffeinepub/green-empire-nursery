import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Review {
    name: string;
    text: string;
    timestamp: bigint;
    rating: bigint;
    location: string;
}
export interface backendInterface {
    getReviews(): Promise<Array<Review>>;
    submitReview(name: string, location: string, text: string, rating: bigint): Promise<boolean>;
}
