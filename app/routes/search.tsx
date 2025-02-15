import { Spot } from "./map";

export async function loader() {
    return [{
        title: "Food Truck", description: "This is an amazing food truck", location: {
            lng: 5.244122, lat: 52.086500
        }
    },
    {
        title: "Food Truck", description: "This is an amazing food truck", location: {
            lng: 5.244122, lat: 52.086500
        }
    },
    {
        title: "Food Truck", description: "This is an amazing food truck", location: {
            lng: 5.244122, lat: 52.086500
        }
    }] as Spot[];
}