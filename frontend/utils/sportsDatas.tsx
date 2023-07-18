export interface ISport {
    label: string;
    selectedIcon: string;
    unselectedIcon: string;
}

export const sports: ISport[] = [
    {
        label: 'All',
        selectedIcon: 'fa-solid fa-medal',
        unselectedIcon: 'fa-regular fa-medal',
    },
    // {
    //     label: 'Dumbbell',
    //     selectedIcon: 'fa-solid fa-dumbbell',
    //     unselectedIcon: 'fa-regular fa-dumbbell',
    // },
    {
        label: 'Swimming',
        selectedIcon: 'fa-solid fa-person-swimming',
        unselectedIcon: 'fa-regular fa-person-swimming',
    },
    {
        label: 'Snowboarding',
        selectedIcon: 'fa-solid fa-person-snowboarding',
        unselectedIcon: 'fa-regular fa-person-snowboarding',
    },
    {
        label: 'Skiing',
        selectedIcon: 'fa-solid fa-person-skiing',
        unselectedIcon: 'fa-regular fa-person-skiing',
    },
    {
        label: 'Futbol',
        selectedIcon: 'fa-solid fa-futbol',
        unselectedIcon: 'fa-regular fa-futbol',
    },
    {
        label: 'Football',
        selectedIcon: 'fa-solid fa-football',
        unselectedIcon: 'fa-regular fa-football',
    },
    {
        label: 'Golf',
        selectedIcon: 'fa-solid fa-golf-ball-tee',
        unselectedIcon: 'fa-regular fa-golf-ball-tee',
    },
    {
        label: 'Biking',
        selectedIcon: 'fa-solid fa-person-biking',
        unselectedIcon: 'fa-regular fa-person-biking',
    },
    // {
    //     label: 'Running',
    //     selectedIcon: 'fa-solid fa-person-running',
    //     unselectedIcon: 'fa-regular fa-person-running',
    // },
    {
        label: 'Basketball',
        selectedIcon: 'fa-solid fa-basketball',
        unselectedIcon: 'fa-regular fa-basketball',
    },
    {
        label: 'Baseball',
        selectedIcon: 'fa-solid fa-baseball-bat-ball',
        unselectedIcon: 'fa-regular fa-baseball-bat-ball',
    }
]