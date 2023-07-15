export interface ITalent {
    name: string;
    sport: string;
    img: string;
    description: string;
    apy: number;
    price: number;
}

export const talents: ITalent[] = [
    {
        apy: Math.random() * 100,
        price: Math.random(),
        name: 'Lionel Messi',
        sport: 'Futbol',
        img: 'talents/LionelMessi.jpg',
        description: 'Considéré comme l\'un des meilleurs joueurs de tous les temps, Messi est connu pour sa maîtrise technique, sa vision du jeu exceptionnelle et sa capacité à marquer des buts incroyables',
    },
    {
        apy: Math.random() * 100,
        price: Math.random(),
        name: 'Cristiano Ronaldo',
        sport: 'Futbol',
        img: 'talents/CristianoRonaldo.jpg',
        description: 'Un athlète phénoménal, Ronaldo est réputé pour sa vitesse, sa puissance et son instinct de buteur hors pair. Il est également un compétiteur acharné et un leader sur le terrain',
    },
    {
        apy: Math.random() * 100,
        price: Math.random(),
        name: 'Neymar Jr.',
        sport: 'Futbol',
        img: 'talents/NeymarJr..jpg',
        description: 'Un dribbleur créatif et un joueur talentueux, Neymar possède une agilité exceptionnelle et une capacité à éliminer les défenseurs avec facilité. Son jeu spectaculaire en fait un plaisir à regarder',
    },
    {
        apy: Math.random() * 100,
        price: Math.random(),
        name: 'Kylian Mbappé',
        sport: 'Futbol',
        img: 'talents/mbappe.jpg',
        description: 'Jeune prodige français, Mbappé est un attaquant rapide et explosif. Il est doté d\'une grande technique, d\'une finition précise et d\'une intelligence de jeu remarquable',
    },
    {
        apy: Math.random() * 100,
        price: Math.random(),
        name: 'Robert Lewandowski',
        sport: 'Futbol',
        img: 'talents/RobertLewandowski.jpg',
        description: 'Un buteur prolifique, Lewandowski est reconnu pour son instinct dans la surface de réparation et sa capacité à marquer des buts de toutes les manières possibles. Il est l\'un des attaquants les plus redoutables au monde',
    },
    {
        apy: Math.random() * 100,
        price: Math.random(),
        name: 'Kevin De Bruyne',
        sport: 'Futbol',
        img: 'talents/KevinDeBruyne.jpg',
        description: 'Un milieu de terrain polyvalent et créatif, De Bruyne est un maître dans la distribution des passes et la création d\'occasions. Sa vision du jeu et sa précision font de lui l\'un des meilleurs milieux de terrain du monde',
    },
    {
        apy: Math.random() * 100,
        price: Math.random(),
        name: 'Mohamed Salah',
        sport: 'Futbol',
        img: 'talents/MohamedSalah.jpg',
        description: 'Un attaquant égyptien rapide et habile, Salah est un véritable cauchemar pour les défenses adverses. Il possède une finition précise et une capacité à marquer des buts importants',
    },
    {
        apy: Math.random() * 100,
        price: Math.random(),
        name: 'Sergio Ramos',
        sport: 'Futbol',
        img: 'talents/SergioRamos.jpg',
        description: 'Un défenseur central robuste et expérimenté, Ramos est réputé pour son leadership et son jeu défensif solide. Il est également un buteur opportun grâce à ses qualités dans les phases arrêtées',
    },
    {
        apy: Math.random() * 100,
        price: Math.random(),
        name: 'Virgil van Dijk',
        sport: 'Futbol',
        img: 'talents/VirgilvanDijk.jpg',
        description: 'Un défenseur central élégant et solide, Van Dijk est connu pour son physique imposant et sa capacité à annihiler les attaques adverses. Il est un pilier défensif essentiel pour son équipe',
    },
    {
        apy: Math.random() * 100,
        price: Math.random(),
        name: 'Jan Oblak',
        sport: 'Futbol',
        img: 'talents/JanOblak.jpg',
        description: 'Considéré comme l\'un des meilleurs gardiens de but au monde, Oblak est remarquable pour ses réflexes rapides, son positionnement précis et sa capacité à réaliser des arrêts spectaculaires. Il est un mur infranchissable dans les cages',
    },
    {
        apy: Math.random() * 100,
        price: Math.random(),
        name: 'Michael Jordan',
        sport: 'Basketball',
        img: 'talents/JanOblak.jpg',
        description: 'Considéré comme le plus grand joueur de basketball de tous les temps, Michael Jordan était un athlète incroyablement polyvalent. Il était connu pour son jeu aérien, sa capacité à marquer des paniers spectaculaires et sa détermination sans faille',
    },
    {
        apy: Math.random() * 100,
        price: Math.random(),
        name: 'LeBron James',
        sport: 'Basketball',
        img: 'talents/JanOblak.jpg',
        description: 'Un joueur emblématique de notre époque, LeBron James est une force dominante sur le terrain. Avec sa taille, sa force physique et sa vision du jeu exceptionnelle, il excelle dans tous les aspects du jeu et est un leader respecté',
    },
    {
        apy: Math.random() * 100,
        price: Math.random(),
        name: 'Magic Johnson',
        sport: 'Basketball',
        img: 'talents/JanOblak.jpg',
        description: 'Magic Johnson était un meneur de jeu brillant, connu pour sa vision du jeu et sa capacité à faire des passes spectaculaires. Il a joué un rôle essentiel dans la dynastie des Los Angeles Lakers dans les années 1980',
    },
    {
        apy: Math.random() * 100,
        price: Math.random(),
        name: 'Kareem Abdul-Jabbar',
        sport: 'Basketball',
        img: 'talents/JanOblak.jpg',
        description: 'Le meilleur marqueur de tous les temps de la NBA, Kareem Abdul-Jabbar était un centre dominant. Il était célèbre pour son fameux "skyhook" et sa longévité dans le sport, ayant joué à un haut niveau pendant près de 20 saisons',
    },
    {
        apy: Math.random() * 100,
        price: Math.random(),
        name: 'Kobe Bryant',
        sport: 'Basketball',
        img: 'talents/JanOblak.jpg',
        description: 'Considéré comme l\'un des plus grands joueurs de tous les temps, Kobe Bryant était un compétiteur féroce. Sa polyvalence, sa détermination et ses capacités offensives exceptionnelles lui ont permis de remporter de nombreux titres et de devenir une légende du jeu',
    },
]