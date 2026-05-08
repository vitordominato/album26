// Elencos prováveis para a Copa do Mundo 2026 — baseados em convocações
// recentes de cada seleção. ⚠️ Estes nomes são uma referência inicial e
// devem ser ajustados quando as convocações finais e o álbum oficial Panini
// forem divulgados.
//
// Cada lista tem 18 jogadores: posições #2-#12 (11 jogadores) e #14-#20
// (7 jogadores). #1 é o escudo metalizado e #13 é a foto do time posado
// (exclusivo McDonald's) — esses são preenchidos automaticamente.

export const RAW_TEAM_PLAYERS = {
  // Grupo A
  MEX: [
    'Guillermo Ochoa', 'Edson Álvarez', 'César Montes', 'Jesús Gallardo',
    'Hirving Lozano', 'Luis Chávez', 'Orbelín Pineda', 'Andrés Guardado',
    'Henry Martín', 'Alexis Vega', 'Raúl Jiménez',
    'Santiago Giménez', 'Diego Lainez', 'Gerardo Arteaga', 'Carlos Salcedo',
    'Néstor Araujo', 'Sebastián Córdova', 'Roberto Alvarado',
  ],
  RSA: [
    'Ronwen Williams', 'Khuliso Mudau', 'Mothobi Mvala', 'Grant Kekana',
    'Aubrey Modiba', 'Teboho Mokoena', 'Bongokuhle Hlongwane', 'Themba Zwane',
    'Percy Tau', 'Lyle Foster', 'Iqraam Rayners',
    'Sphephelo Sithole', 'Evidence Makgopa', 'Zakhele Lepasa', 'Lebo Mothiba',
    'Bandile Shandu', 'Siyanda Xulu', 'Tshegofatso Mabasa',
  ],
  KOR: [
    'Kim Seung-gyu', 'Kim Min-jae', 'Kim Young-gwon', 'Kim Jin-su',
    'Lee Jae-sung', 'Lee Kang-in', 'Hwang Hee-chan', 'Son Heung-min',
    'Cho Gue-sung', 'Hwang In-beom', 'Park Yong-woo',
    'Hong Hyun-seok', 'Cho Yu-min', 'Oh Hyeon-gyu', 'Seol Young-woo',
    'Jung Woo-young', 'Lee Soon-min', 'Joo Min-kyu',
  ],
  CZE: [
    'Jindřich Staněk', 'Vladimír Coufal', 'Tomáš Vlček', 'David Zima',
    'David Jurásek', 'Tomáš Souček', 'Vladimír Darida', 'Lukáš Provod',
    'Pavel Šulc', 'Patrik Schick', 'Adam Hložek',
    'Mojmír Chytil', 'Tomáš Chorý', 'Adam Karabec', 'Lukáš Sadílek',
    'Petr Ševčík', 'Tomáš Holeš', 'Václav Černý',
  ],

  // Grupo B
  CAN: [
    'Milan Borjan', 'Alphonso Davies', 'Stephen Eustáquio', 'Atiba Hutchinson',
    'Jonathan Osorio', 'Jonathan David', 'Cyle Larin', 'Tajon Buchanan',
    'Liam Millar', 'Ismaël Koné', 'Richie Laryea',
    'Sam Adekugbe', 'Kamal Miller', 'Steven Vitória', 'Daniel Jebbison',
    'David Hoilett', 'Mark-Anthony Kaye', 'Lucas Cavallini',
  ],
  BIH: [
    'Ibrahim Šehić', 'Sead Kolašinac', 'Anel Ahmedhodžić', 'Dennis Hadžikadunić',
    'Dejan Lovren', 'Edin Višća', 'Sanjin Prcić', 'Miralem Pjanić',
    'Edin Džeko', 'Smail Prevljak', 'Haris Hajradinović',
    'Stjepan Lončar', 'Tarik Muharemović', 'Adnan Kovačević', 'Adis Hadžanović',
    'Daniel Avdijaj', 'Said Hamulić', 'Adin Hušidić',
  ],
  QAT: [
    'Saad Al-Sheeb', 'Pedro Miguel', 'Tarek Salman', 'Boualem Khoukhi',
    'Bassam Al-Rawi', 'Karim Boudiaf', 'Hassan Al-Haydos', 'Akram Afif',
    'Almoez Ali', 'Ahmed Alaaeldin', 'Mohammed Muntari',
    'Yusuf Abdurisag', 'Abdulaziz Hatem', 'Homam Ahmed', 'Edmilson Junior',
    'Ismaeel Mohammad', 'Khalid Muneer', 'Mohamed Waad',
  ],
  SUI: [
    'Yann Sommer', 'Manuel Akanji', 'Nico Elvedi', 'Fabian Schär',
    'Ricardo Rodríguez', 'Granit Xhaka', 'Remo Freuler', 'Xherdan Shaqiri',
    'Breel Embolo', 'Ruben Vargas', 'Zeki Amdouni',
    'Dan Ndoye', 'Steven Zuber', 'Renato Steffen', 'Silvan Widmer',
    'Eray Cömert', 'Fabian Rieder', 'Denis Zakaria',
  ],

  // Grupo C
  BRA: [
    'Alisson', 'Danilo', 'Marquinhos', 'Éder Militão',
    'Gabriel Magalhães', 'Casemiro', 'Bruno Guimarães', 'Lucas Paquetá',
    'Vinícius Júnior', 'Rodrygo', 'Neymar',
    'Raphinha', 'Endrick', 'Richarlison', 'Gabriel Martinelli',
    'Antony', 'Ederson', 'Thiago Silva',
  ],
  MAR: [
    'Yassine Bounou', 'Achraf Hakimi', 'Romain Saïss', 'Nayef Aguerd',
    'Noussair Mazraoui', 'Sofyan Amrabat', 'Azzedine Ounahi', 'Hakim Ziyech',
    'Selim Amallah', 'Youssef En-Nesyri', 'Sofiane Boufal',
    'Abde Ezzalzouli', 'Bilal El Khannouss', 'Yassine Bammou', 'Walid Cheddira',
    'Adam Masina', 'Imran Louza', 'Brahim Díaz',
  ],
  HAI: [
    'Johnny Placide', 'Andrew Jean-Baptiste', 'Carlens Arcus', 'Ricardo Adé',
    'Jems Geffrard', 'Soni Mustivar', 'Wilde-Donald Guerrier', 'Steeven Saba',
    'Frantzdy Pierrot', 'Jean-Eudes Maurice', 'Duckens Nazon',
    'Derrick Etienne Jr.', 'Wilkenson Nazon', 'Mikael Cantave', 'Hervé Bazile',
    'Carl-Frédérik Koh', 'Donald Guerrier', 'Roberto Louima',
  ],
  SCO: [
    'Angus Gunn', 'Aaron Hickey', 'Jack Hendry', 'Grant Hanley',
    'Andrew Robertson', 'John McGinn', 'Callum McGregor', 'Scott McTominay',
    'Stuart Armstrong', 'Lyndon Dykes', 'Ché Adams',
    'Ryan Christie', 'Lawrence Shankland', 'Tommy Conway', 'Kieran Tierney',
    'Anthony Ralston', 'Billy Gilmour', 'James Forrest',
  ],

  // Grupo D
  USA: [
    'Matt Turner', 'Sergiño Dest', 'Tim Ream', 'Chris Richards',
    'Antonee Robinson', 'Tyler Adams', 'Yunus Musah', 'Weston McKennie',
    'Christian Pulisic', 'Tim Weah', 'Folarin Balogun',
    'Gio Reyna', 'Brenden Aaronson', 'Ricardo Pepi', 'Haji Wright',
    'Joe Scally', 'Cameron Carter-Vickers', 'Luca de la Torre',
  ],
  PAR: [
    'Carlos Coronel', 'Robert Rojas', 'Junior Alonso', 'Omar Alderete',
    'Juan Cáceres', 'Mathías Villasanti', 'Andrés Cubas', 'Diego Gómez',
    'Miguel Almirón', 'Antonio Sanabria', 'Damián Bobadilla',
    'Julio Enciso', 'Adam Bareiro', 'Ronaldo Martínez', 'Hernesto Caballero',
    'Iván Ramírez', 'Mathías Pérez', 'Wilder Viera',
  ],
  AUS: [
    'Mathew Ryan', 'Milos Degenek', 'Harry Souttar', 'Kye Rowles',
    'Aziz Behich', 'Aaron Mooy', 'Jackson Irvine', 'Riley McGree',
    'Mathew Leckie', 'Mitchell Duke', 'Awer Mabil',
    'Cameron Devlin', 'Jordy Bos', 'Lewis Miller', 'Jason Cummings',
    'Connor Metcalfe', 'Keanu Baccus', 'Jamie Maclaren',
  ],
  TUR: [
    'Uğurcan Çakır', 'Zeki Çelik', 'Merih Demiral', 'Samet Akaydın',
    'Ferdi Kadıoğlu', 'Hakan Çalhanoğlu', 'Salih Özcan', 'Kerem Aktürkoğlu',
    'Arda Güler', 'Kenan Yıldız', 'Cenk Tosun',
    'Yusuf Sarı', 'Barış Alper Yılmaz', 'İrfan Can Kahveci', 'Abdülkerim Bardakcı',
    'Eren Elmalı', 'Orkun Kökçü', 'Çağlar Söyüncü',
  ],

  // Grupo E
  GER: [
    'Manuel Neuer', 'Joshua Kimmich', 'Antonio Rüdiger', 'Jonathan Tah',
    'Maximilian Mittelstädt', 'Toni Kroos', 'İlkay Gündoğan', 'Jamal Musiala',
    'Florian Wirtz', 'Leroy Sané', 'Kai Havertz',
    'Niclas Füllkrug', 'Robin Koch', 'Pascal Groß', 'Nico Schlotterbeck',
    'Marc-André ter Stegen', 'Thomas Müller', 'Benjamin Henrichs',
  ],
  CUW: [
    'Eloy Room', 'Cuco Martina', 'Juriën Gaari', 'Roshon van Eijma',
    'Brandley Kuwas', 'Leandro Bacuna', 'Tahith Chong', 'Juninho Bacuna',
    'Jurgen Locadia', 'Rangelo Janga', 'Jamilhio Rigters',
    'Jearl Margaritha', 'Sherel Floranus', 'Cyril Ngonge', 'Daryl van Mieghem',
    'Sontje Hansen', 'Vurnon Anita', 'Eros Alves',
  ],
  CIV: [
    'Yahia Fofana', 'Serge Aurier', 'Wilfried Singo', 'Évan Ndicka',
    'Ghislain Konan', 'Franck Kessié', 'Jean Michaël Seri', 'Ibrahim Sangaré',
    'Sébastien Haller', 'Wilfried Zaha', 'Nicolas Pépé',
    'Simon Adingra', 'Jérémie Boga', 'Jonathan Bamba', 'Max Gradel',
    'Cédric Bakambu', 'Christian Kouamé', 'Karim Konaté',
  ],
  ECU: [
    'Hernán Galíndez', 'Pervis Estupiñán', 'Piero Hincapié', 'Félix Torres',
    'Ángelo Preciado', 'Moisés Caicedo', 'Carlos Gruezo', 'Jeremy Sarmiento',
    'Kevin Rodríguez', 'Enner Valencia', 'Gonzalo Plata',
    'Alan Minda', 'Jordan Sierra', 'Pedro Vite', 'Joao Rojas',
    'Kendry Páez', 'Willian Pacho', 'John Yeboah',
  ],

  // Grupo F
  NED: [
    'Bart Verbruggen', 'Denzel Dumfries', 'Stefan de Vrij', 'Virgil van Dijk',
    'Nathan Aké', 'Jurriën Timber', 'Frenkie de Jong', 'Tijjani Reijnders',
    'Xavi Simons', 'Memphis Depay', 'Cody Gakpo',
    'Joey Veerman', 'Donyell Malen', 'Wout Weghorst', 'Mats Wieffer',
    'Daley Blind', 'Steven Bergwijn', 'Quilindschy Hartman',
  ],
  JPN: [
    'Daniel Schmidt', 'Wataru Endo', 'Takehiro Tomiyasu', 'Ko Itakura',
    'Yukinari Sugawara', 'Daichi Kamada', 'Hidemasa Morita', 'Takefusa Kubo',
    'Ritsu Doan', 'Kaoru Mitoma', 'Daizen Maeda',
    'Junya Ito', 'Ayase Ueda', 'Keito Nakamura', 'Maya Yoshida',
    'Hiroki Ito', 'Genki Haraguchi', 'Shogo Taniguchi',
  ],
  SWE: [
    'Robin Olsen', 'Emil Krafth', 'Victor Lindelöf', 'Isak Hien',
    'Ludwig Augustinsson', 'Jens Cajuste', 'Mattias Svanberg', 'Albin Ekdal',
    'Dejan Kulusevski', 'Alexander Isak', 'Viktor Gyökeres',
    'Anthony Elanga', 'Daniel Sundgren', 'Kristoffer Olsson', 'Robin Quaison',
    'Mattias Svensson', 'Hugo Larsson', 'Yasin Ayari',
  ],
  TUN: [
    'Aymen Dahmen', 'Mohamed Dräger', 'Yassine Meriah', 'Dylan Bronn',
    'Ali Abdi', 'Ellyes Skhiri', 'Aïssa Laidouni', 'Wahbi Khazri',
    'Mohamed Ali Ben Romdhane', 'Youssef Msakni', 'Naïm Sliti',
    'Hamza Rafia', 'Issam Jebali', 'Ferjani Sassi', 'Hannibal Mejbri',
    'Anis Slimane', 'Bilel Ifa', 'Seifeddine Jaziri',
  ],

  // Grupo G
  BEL: [
    'Koen Casteels', 'Timothy Castagne', 'Wout Faes', 'Jan Vertonghen',
    'Arthur Theate', 'Maxim De Cuyper', 'Youri Tielemans', 'Amadou Onana',
    'Kevin De Bruyne', 'Charles De Ketelaere', 'Jérémy Doku',
    'Romelu Lukaku', 'Leandro Trossard', 'Dodi Lukébakio', 'Yannick Carrasco',
    'Johan Bakayoko', 'Loïs Openda', 'Axel Witsel',
  ],
  EGY: [
    'Mohamed El Shenawy', 'Ahmed Hegazi', 'Mohamed Abdelmonem', 'Mohamed Hany',
    'Ahmed Fatouh', 'Mohamed Elneny', 'Hamdi Fathi', 'Trezeguet',
    'Mohamed Salah', 'Mostafa Mohamed', 'Omar Marmoush',
    'Marwan Hamdi', 'Akram Tawfik', 'Karim Fouad', 'Emam Ashour',
    'Amr El Solia', 'Omar Kamal', 'Mahmoud Hassan',
  ],
  IRN: [
    'Alireza Beiranvand', 'Sadegh Moharrami', 'Morteza Pouraliganji', 'Shojae Khalilzadeh',
    'Milad Mohammadi', 'Saeid Ezatolahi', 'Saman Ghoddos', 'Ehsan Hajsafi',
    'Sardar Azmoun', 'Mehdi Taremi', 'Alireza Jahanbakhsh',
    'Ali Gholizadeh', 'Karim Ansarifard', 'Omid Noorafkan', 'Hossein Hosseini',
    'Majid Hosseini', 'Ali Karimi', 'Mehdi Torabi',
  ],
  NZL: [
    'Oliver Sail', 'Tim Payne', 'Michael Boxall', 'Tommy Smith',
    'Liberato Cacace', 'Joe Bell', 'Marko Stamenić', 'Sarpreet Singh',
    'Chris Wood', 'Kosta Barbarouses', 'Matthew Garbett',
    'Elijah Just', 'Logan Rogerson', 'Storm Roux', 'Alex Greive',
    'Ben Waine', 'Callum McCowatt', 'Bill Tuiloma',
  ],

  // Grupo H
  ESP: [
    'Unai Simón', 'Dani Carvajal', 'Aymeric Laporte', 'Robin Le Normand',
    'Marc Cucurella', 'Rodri', 'Pedri', 'Fabián Ruiz',
    'Mikel Merino', 'Lamine Yamal', 'Nico Williams',
    'Álvaro Morata', 'Mikel Oyarzabal', 'Ferran Torres', 'Joselu',
    'Dani Olmo', 'Pau Cubarsí', 'Pedro Porro',
  ],
  CPV: [
    'Vozinha', 'Roberto Lopes', 'Stopira', 'Diney Borges',
    'Logan Costa', 'Steven Moreira', 'Ryan Mendes', 'Jamiro Monteiro',
    'Gilson Tavares', 'Garry Rodrigues', 'Kévin Lenini',
    'Bryan Teixeira', 'Bebé', 'Heriberto Tavares', 'Willy Semedo',
    'Yannick Semedo', 'Dailon Livramento', 'Sidny Cabral',
  ],
  KSA: [
    'Mohammed Al-Owais', 'Saud Abdulhamid', 'Hassan Tambakti', 'Ali Al-Bulayhi',
    'Yasser Al-Shahrani', 'Mohamed Kanno', 'Salem Al-Dawsari', 'Salman Al-Faraj',
    'Firas Al-Buraikan', 'Saleh Al-Shehri', 'Abdulrahman Ghareeb',
    'Riyad Sharahili', 'Nawaf Al-Aqidi', 'Ali Al-Hassan', 'Sami Al-Najei',
    'Talal Haji', 'Hatan Bahebri', 'Mukhtar Ali',
  ],
  URU: [
    'Sergio Rochet', 'Nahitan Nández', 'José Giménez', 'Ronald Araújo',
    'Mathías Olivera', 'Manuel Ugarte', 'Federico Valverde', 'Rodrigo Bentancur',
    'Nicolás de la Cruz', 'Maximiliano Araújo', 'Darwin Núñez',
    'Facundo Pellistri', 'Brian Rodríguez', 'Cristian Olivera', 'Federico Viñas',
    'Luis Suárez', 'Maxi Gómez', 'Edinson Cavani',
  ],

  // Grupo I
  FRA: [
    'Mike Maignan', 'Jules Koundé', 'Théo Hernández', 'Dayot Upamecano',
    'William Saliba', 'Aurélien Tchouaméni', 'Eduardo Camavinga', 'Antoine Griezmann',
    'Adrien Rabiot', 'Kylian Mbappé', 'Ousmane Dembélé',
    'Bradley Barcola', 'Randal Kolo Muani', 'Marcus Thuram', 'Christopher Nkunku',
    'Kingsley Coman', 'N\'Golo Kanté', 'Ibrahima Konaté',
  ],
  SEN: [
    'Édouard Mendy', 'Kalidou Koulibaly', 'Abdou Diallo', 'Cheikhou Kouyaté',
    'Pape Abou Cissé', 'Idrissa Gana Gueye', 'Pape Matar Sarr', 'Krepin Diatta',
    'Sadio Mané', 'Ismaïla Sarr', 'Boulaye Dia',
    'Habib Diallo', 'Pathé Ciss', 'Iliman Ndiaye', 'Nicolas Jackson',
    'Lamine Camara', 'Pape Gueye', 'Bamba Dieng',
  ],
  IRQ: [
    'Jalal Hassan', 'Merchas Doski', 'Frans Pütros', 'Ali Adnan',
    'Hussein Ali', 'Bashar Resan', 'Amjad Attwan', 'Ali Jasim',
    'Ibrahim Bayesh', 'Aymen Hussein', 'Mohanad Ali',
    'Mohammed Qassim', 'Justin Meram', 'Hussein Ammar', 'Ali Al-Hamadi',
    'Hussein Saleh', 'Yousif Amyn', 'Manaf Younis',
  ],
  NOR: [
    'Ørjan Nyland', 'Stefan Strandberg', 'Kristoffer Ajer', 'Leo Østigård',
    'Birger Meling', 'Sander Berge', 'Patrick Berg', 'Martin Ødegaard',
    'Mohamed Elyounoussi', 'Erling Haaland', 'Alexander Sørloth',
    'Antonio Nusa', 'Oscar Bobb', 'Andreas Schjelderup', 'Fredrik Aursnes',
    'Julian Ryerson', 'Marcus Pedersen', 'Morten Thorsby',
  ],

  // Grupo J
  ARG: [
    'Emiliano Martínez', 'Cristian Romero', 'Nicolás Otamendi', 'Lisandro Martínez',
    'Nicolás Tagliafico', 'Nahuel Molina', 'Rodrigo De Paul', 'Leandro Paredes',
    'Enzo Fernández', 'Alexis Mac Allister', 'Lionel Messi',
    'Ángel Di María', 'Lautaro Martínez', 'Julián Álvarez', 'Paulo Dybala',
    'Marcos Acuña', 'Giovani Lo Celso', 'Nicolás González',
  ],
  ALG: [
    'Raïs M\'Bolhi', 'Aïssa Mandi', 'Ramy Bensebaini', 'Youcef Atal',
    'Mohamed Amine Tougai', 'Sofiane Feghouli', 'Adlène Guedioura', 'Riyad Mahrez',
    'Ismaël Bennacer', 'Saïd Benrahma', 'Baghdad Bounedjah',
    'Islam Slimani', 'Yacine Brahimi', 'Andy Delort', 'Mohamed Belaïli',
    'Houssem Aouar', 'Yassine Benzia', 'Ahmed Touba',
  ],
  AUT: [
    'Patrick Pentz', 'Stefan Posch', 'Maximilian Wöber', 'Kevin Danso',
    'Philipp Mwene', 'Konrad Laimer', 'Christoph Baumgartner', 'Marcel Sabitzer',
    'Marko Arnautović', 'Michael Gregoritsch', 'Romano Schmid',
    'Florian Grillitsch', 'Florian Kainz', 'Patrick Wimmer', 'David Alaba',
    'Xaver Schlager', 'Nicolas Seiwald', 'Maximilian Entrup',
  ],
  JOR: [
    'Yazeed Abulaila', 'Bara\' Marei', 'Salem Al-Ajalin', 'Ehsan Haddad',
    'Mohammad Abu Hashish', 'Noor Al-Rawabdeh', 'Mahmoud Al-Mardi', 'Yazan Al-Naimat',
    'Mousa Al-Tamari', 'Anas Al-Awadat', 'Hamza Al-Dardour',
    'Mahmoud Al-Mawas', 'Saleh Rateb', 'Ali Olwan', 'Yousef Abu Jalboush',
    'Salem Al-Faqih', 'Abdallah Nasib', 'Adham Al-Quraan',
  ],

  // Grupo K
  POR: [
    'Diogo Costa', 'João Cancelo', 'Pepe', 'Rúben Dias',
    'Nuno Mendes', 'João Palhinha', 'Bruno Fernandes', 'Bernardo Silva',
    'João Félix', 'Cristiano Ronaldo', 'Rafael Leão',
    'Diogo Jota', 'Vitinha', 'Rúben Neves', 'Otávio',
    'Gonçalo Ramos', 'Pedro Neto', 'António Silva',
  ],
  COD: [
    'Lionel Mpasi', 'Arthur Masuaku', 'Chancel Mbemba', 'Marcel Tisserand',
    'Gédéon Kalulu', 'Aaron Tshibola', 'Samuel Moutoussamy', 'Théo Bongonda',
    'Cédric Bakambu', 'Yoane Wissa', 'Silas Katompa',
    'Yannick Bolasie', 'Charles Pickel', 'Meschack Elia', 'Edo Kayembe',
    'Glody Lilepo', 'Brilhante Vitamina', 'Joël Beya',
  ],
  UZB: [
    'Utkir Yusupov', 'Khojiakbar Alijonov', 'Khusniddin Aliqulov', 'Abbosbek Fayzullaev',
    'Akmal Mozgovoy', 'Jaloliddin Masharipov', 'Otabek Shukurov', 'Eldor Shomurodov',
    'Igor Sergeev', 'Azizbek Turgunboev', 'Doston Tuychiev',
    'Khojimat Erkinov', 'Diyor Kholmatov', 'Sherzod Nasrullaev', 'Sanjar Tursunov',
    'Bobir Davlatov', 'Husayin Norchaev', 'Oston Urunov',
  ],
  COL: [
    'Camilo Vargas', 'Daniel Muñoz', 'Davinson Sánchez', 'Carlos Cuesta',
    'Johan Mojica', 'James Rodríguez', 'Mateus Uribe', 'Jefferson Lerma',
    'Richard Ríos', 'Luis Díaz', 'Jhon Córdoba',
    'Yerry Mina', 'Frank Fabra', 'Rafael Santos Borré', 'Juan Cuadrado',
    'Miguel Borja', 'Luis Sinisterra', 'Jhon Arias',
  ],

  // Grupo L
  ENG: [
    'Jordan Pickford', 'Kyle Walker', 'John Stones', 'Harry Maguire',
    'Luke Shaw', 'Trent Alexander-Arnold', 'Declan Rice', 'Jude Bellingham',
    'Bukayo Saka', 'Phil Foden', 'Harry Kane',
    'Marcus Rashford', 'Cole Palmer', 'Jarrod Bowen', 'Anthony Gordon',
    'Ollie Watkins', 'Conor Gallagher', 'Eberechi Eze',
  ],
  CRO: [
    'Dominik Livaković', 'Josip Juranović', 'Joško Gvardiol', 'Josip Šutalo',
    'Borna Sosa', 'Luka Modrić', 'Marcelo Brozović', 'Mateo Kovačić',
    'Mario Pašalić', 'Andrej Kramarić', 'Bruno Petković',
    'Marko Livaja', 'Lovro Majer', 'Nikola Vlašić', 'Luka Sučić',
    'Petar Sučić', 'Ivan Perišić', 'Ante Budimir',
  ],
  GHA: [
    'Lawrence Ati-Zigi', 'Daniel Amartey', 'Jonathan Mensah', 'Mohammed Salisu',
    'Alidu Seidu', 'Thomas Partey', 'Salis Abdul Samed', 'Mohammed Kudus',
    'André Ayew', 'Jordan Ayew', 'Iñaki Williams',
    'Antoine Semenyo', 'Tariq Lamptey', 'Alexander Djiku', 'Joseph Paintsil',
    'Forson Amankwah', 'Ernest Nuamah', 'Kamaldeen Sulemana',
  ],
  PAN: [
    'Orlando Mosquera', 'Michael Murillo', 'Andrés Andrade', 'Édgar Bárcenas',
    'Adalberto Carrasquilla', 'José Fajardo', 'Aníbal Godoy', 'Eric Davis',
    'Cristian Martínez', 'José Luis Rodríguez', 'Cecilio Waterman',
    'Ismael Díaz', 'Tomás Rodríguez', 'Iván Anderson', 'Edgardo Fariña',
    'Yoel Bárcenas', 'Fidel Escobar', 'Adalberto Carrasquilla Jr.',
  ],
};

// Constrói o mapa final TEAM_PLAYERS, indexado por número do cromo (1..20).
// As 18 entradas viram cromos #2-#12 e #14-#20 (slots #1 e #13 ficam vazios
// porque getStickerInfo já trata escudo e time posado).
export function buildTeamPlayers(raw) {
  const out = {};
  for (const [code, names] of Object.entries(raw)) {
    const arr = new Array(20).fill('');
    // posições #2-#12 → indexes 1..11
    for (let i = 0; i < 11 && i < names.length; i++) arr[i + 1] = names[i];
    // posições #14-#20 → indexes 13..19
    for (let i = 0; i < 7 && i + 11 < names.length; i++) arr[i + 13] = names[i + 11];
    out[code] = arr;
  }
  return out;
}

export const TEAM_PLAYERS = buildTeamPlayers(RAW_TEAM_PLAYERS);
