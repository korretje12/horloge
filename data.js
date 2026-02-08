// Watch database
const watchDatabase = [
    {
        id: 1,
        brand: "Rolex",
        model: "Submariner",
        price: 8950,
        image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=Rolex+Submariner",
        reference: "124060",
        year: 2023,
        description: "Iconisch duikhorloge met 300m waterbestendigheid"
    },
    {
        id: 2,
        brand: "Omega",
        model: "Speedmaster Professional",
        price: 6500,
        image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=Omega+Speedmaster",
        reference: "310.30.42.50.01.001",
        year: 2022,
        description: "Het legendarische 'Moonwatch' horloge"
    },
    {
        id: 3,
        brand: "Seiko",
        model: "Prospex Diver",
        price: 450,
        image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=Seiko+Prospex",
        reference: "SPB143",
        year: 2021,
        description: "Betaalbare duiker met uitstekende kwaliteit"
    },
    {
        id: 4,
        brand: "Tag Heuer",
        model: "Carrera",
        price: 5200,
        image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=Tag+Heuer+Carrera",
        reference: "CBK2116",
        year: 2023,
        description: "Sportieve chronograaf met race-DNA"
    },
    {
        id: 5,
        brand: "Tudor",
        model: "Black Bay 58",
        price: 3750,
        image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=Tudor+Black+Bay",
        reference: "79030N",
        year: 2022,
        description: "Vintage-geïnspireerde duiker"
    },
    {
        id: 6,
        brand: "Casio",
        model: "G-Shock GA-2100",
        price: 120,
        image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=Casio+G-Shock",
        reference: "GA-2100-1A1",
        year: 2023,
        description: "De 'CasiOak' - stijlvolle en stoere G-Shock"
    },
    {
        id: 7,
        brand: "Rolex",
        model: "Datejust 41",
        price: 9200,
        image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=Rolex+Datejust",
        reference: "126300",
        year: 2023,
        description: "Het klassieke dress watch icoon"
    },
    {
        id: 8,
        brand: "Omega",
        model: "Seamaster Diver 300M",
        price: 5400,
        image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=Omega+Seamaster",
        reference: "210.30.42.20.01.001",
        year: 2022,
        description: "James Bond's favoriete duikhorloge"
    },
    {
        id: 9,
        brand: "Seiko",
        model: "5 Sports",
        price: 320,
        image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=Seiko+5",
        reference: "SRPD55",
        year: 2021,
        description: "Betaalbaar automatisch horloge met karakter"
    },
    {
        id: 10,
        brand: "Tudor",
        model: "Pelagos",
        price: 4100,
        image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=Tudor+Pelagos",
        reference: "25600TN",
        year: 2023,
        description: "Professionele duiker met titanium kast"
    }
];

// Preset wrist images (base64 placeholders for demonstration)
const presetWrists = {
    1: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23f5deb3' width='800' height='600'/%3E%3Cellipse cx='400' cy='300' rx='200' ry='150' fill='%23daa520' opacity='0.3'/%3E%3Ctext x='400' y='300' font-size='24' text-anchor='middle' fill='%23666'%3EPreset Pols 1%3C/text%3E%3C/svg%3E",
    2: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23d2b48c' width='800' height='600'/%3E%3Cellipse cx='400' cy='300' rx='180' ry='140' fill='%23cd853f' opacity='0.3'/%3E%3Ctext x='400' y='300' font-size='24' text-anchor='middle' fill='%23666'%3EPreset Pols 2%3C/text%3E%3C/svg%3E",
    3: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23c19a6b' width='800' height='600'/%3E%3Cellipse cx='400' cy='300' rx='220' ry='160' fill='%23a0826d' opacity='0.3'/%3E%3Ctext x='400' y='300' font-size='24' text-anchor='middle' fill='%23666'%3EPreset Pols 3%3C/text%3E%3C/svg%3E"
};
