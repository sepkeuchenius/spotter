import { Spot } from "./map";

export async function loader() {
    return [{
        title: "test Truck", description: "test is an amazing food truck", location: {
            lng: 5.244122, lat: 52.086100
        }
    },
    {
        title: "test Truck", description: "test is an amazing food truck", location: {
            lng: 5.243122, lat: 52.086500
        }
    },
    {
        title: "test Truck", description: "test is an amazing food truck", location: {
            lng: 5.245322, lat: 52.086500
        }
    }] as Spot[];
}