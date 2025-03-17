export const dataLine = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

    datasets:[
         {
            label: 'Complaints',
            data:[0,2,0,5,1,0,0,2,1,0,6,0],
            fill: false,
            backgroundColor:'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
         },
    ],
};

export const dataBar = {
    labels: ['Area 1', 'Area 2', 'Area 3', 'Area 4', 'Area 5'],
    datasets: [
        {
            label: 'Users',
            data: [20, 35, 26, 10, 40],
            backgroundColor: 'rgba(0, 0, 255, 0.2)', // Light blue background with 20% opacity
            borderColor: 'rgba(0, 0, 255, 1)',       // Solid blue border
            borderWidth: 1,
        },
    ],
};
