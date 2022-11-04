export interface ip_Coordinates {
    loc: string
}

export interface google_Coordinates {
    results : [
        geometry: [
            location: [
                lat: string,
                lng: string
            ]
        ]
    ]
 }

/*export interface googleCoordinates{

}*/