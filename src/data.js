// ============================ DADOS ============================

export const TEAMS = [
  { code: 'CAN', name: 'Canadá',           flag: '🇨🇦', conf: 'CONCACAF', host: true },
  { code: 'MEX', name: 'México',           flag: '🇲🇽', conf: 'CONCACAF', host: true },
  { code: 'USA', name: 'Estados Unidos',   flag: '🇺🇸', conf: 'CONCACAF', host: true },
  { code: 'ARG', name: 'Argentina',        flag: '🇦🇷', conf: 'CONMEBOL' },
  { code: 'BRA', name: 'Brasil',           flag: '🇧🇷', conf: 'CONMEBOL' },
  { code: 'COL', name: 'Colômbia',         flag: '🇨🇴', conf: 'CONMEBOL' },
  { code: 'ECU', name: 'Equador',          flag: '🇪🇨', conf: 'CONMEBOL' },
  { code: 'PAR', name: 'Paraguai',         flag: '🇵🇾', conf: 'CONMEBOL' },
  { code: 'URU', name: 'Uruguai',          flag: '🇺🇾', conf: 'CONMEBOL' },
  { code: 'AUT', name: 'Áustria',          flag: '🇦🇹', conf: 'UEFA' },
  { code: 'BEL', name: 'Bélgica',          flag: '🇧🇪', conf: 'UEFA' },
  { code: 'CRO', name: 'Croácia',          flag: '🇭🇷', conf: 'UEFA' },
  { code: 'CZE', name: 'República Tcheca', flag: '🇨🇿', conf: 'UEFA' },
  { code: 'DEN', name: 'Dinamarca',        flag: '🇩🇰', conf: 'UEFA' },
  { code: 'ENG', name: 'Inglaterra',       flag: '🏴\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}', conf: 'UEFA' },
  { code: 'ESP', name: 'Espanha',          flag: '🇪🇸', conf: 'UEFA' },
  { code: 'FRA', name: 'França',           flag: '🇫🇷', conf: 'UEFA' },
  { code: 'GER', name: 'Alemanha',         flag: '🇩🇪', conf: 'UEFA' },
  { code: 'ITA', name: 'Itália',           flag: '🇮🇹', conf: 'UEFA' },
  { code: 'NED', name: 'Holanda',          flag: '🇳🇱', conf: 'UEFA' },
  { code: 'NOR', name: 'Noruega',          flag: '🇳🇴', conf: 'UEFA' },
  { code: 'POL', name: 'Polônia',          flag: '🇵🇱', conf: 'UEFA' },
  { code: 'POR', name: 'Portugal',         flag: '🇵🇹', conf: 'UEFA' },
  { code: 'SUI', name: 'Suíça',            flag: '🇨🇭', conf: 'UEFA' },
  { code: 'UKR', name: 'Ucrânia',          flag: '🇺🇦', conf: 'UEFA' },
  { code: 'CRC', name: 'Costa Rica',       flag: '🇨🇷', conf: 'CONCACAF' },
  { code: 'JAM', name: 'Jamaica',          flag: '🇯🇲', conf: 'CONCACAF' },
  { code: 'PAN', name: 'Panamá',           flag: '🇵🇦', conf: 'CONCACAF' },
  { code: 'AUS', name: 'Austrália',        flag: '🇦🇺', conf: 'AFC' },
  { code: 'IRN', name: 'Irã',              flag: '🇮🇷', conf: 'AFC' },
  { code: 'IRQ', name: 'Iraque',           flag: '🇮🇶', conf: 'AFC' },
  { code: 'JPN', name: 'Japão',            flag: '🇯🇵', conf: 'AFC' },
  { code: 'KOR', name: 'Coreia do Sul',    flag: '🇰🇷', conf: 'AFC' },
  { code: 'QAT', name: 'Catar',            flag: '🇶🇦', conf: 'AFC' },
  { code: 'SAU', name: 'Arábia Saudita',   flag: '🇸🇦', conf: 'AFC' },
  { code: 'UAE', name: 'Emirados Árabes',  flag: '🇦🇪', conf: 'AFC' },
  { code: 'ALG', name: 'Argélia',          flag: '🇩🇿', conf: 'CAF' },
  { code: 'CIV', name: 'Costa do Marfim',  flag: '🇨🇮', conf: 'CAF' },
  { code: 'CMR', name: 'Camarões',         flag: '🇨🇲', conf: 'CAF' },
  { code: 'EGY', name: 'Egito',            flag: '🇪🇬', conf: 'CAF' },
  { code: 'GHA', name: 'Gana',             flag: '🇬🇭', conf: 'CAF' },
  { code: 'MAR', name: 'Marrocos',         flag: '🇲🇦', conf: 'CAF' },
  { code: 'NGA', name: 'Nigéria',          flag: '🇳🇬', conf: 'CAF' },
  { code: 'SEN', name: 'Senegal',          flag: '🇸🇳', conf: 'CAF' },
  { code: 'TUN', name: 'Tunísia',          flag: '🇹🇳', conf: 'CAF' },
  { code: 'NZL', name: 'Nova Zelândia',    flag: '🇳🇿', conf: 'OFC' },
  { code: 'PER', name: 'Peru',             flag: '🇵🇪', conf: 'REPESCAGEM' },
  { code: 'SWE', name: 'Suécia',           flag: '🇸🇪', conf: 'REPESCAGEM' },
];

// 18 jogadores por seleção (figurinhas 3 a 20; #1=escudo, #2=foto da equipe)
export const TEAM_PLAYERS = {
  CAN: ['Milan Borjan','Dayne St. Clair','Alistair Johnston','Steven Vitória','Kamal Miller','Sam Adekugbe','Richie Laryea','Stephen Eustáquio','Jonathan Osorio','Atiba Hutchinson','Mark-Anthony Kaye','Ismaël Koné','Alphonso Davies','Jonathan David','Cyle Larin','Tajon Buchanan','Junior Hoilett','Lucas Cavallini'],
  MEX: ['Guillermo Ochoa','Alfredo Talavera','Edson Álvarez','Héctor Moreno','César Montes','Jesús Gallardo','Néstor Araujo','Johan Vásquez','Andrés Guardado','Luis Chávez','Héctor Herrera','Carlos Rodríguez','Orbelín Pineda','Hirving Lozano','Raúl Jiménez','Henry Martín','Alexis Vega','Santiago Giménez'],
  USA: ['Matt Turner','Ethan Horvath','Sergiño Dest','Antonee Robinson','Tim Ream','Walker Zimmerman','Chris Richards','DeAndre Yedlin','Tyler Adams','Weston McKennie','Yunus Musah','Luca de la Torre','Christian Pulisic','Tim Weah','Gio Reyna','Brenden Aaronson','Jesús Ferreira','Folarin Balogun'],
  ARG: ['Emiliano Martínez','Franco Armani','Cristian Romero','Nicolás Otamendi','Lisandro Martínez','Nahuel Molina','Marcos Acuña','Nicolás Tagliafico','Rodrigo De Paul','Enzo Fernández','Alexis Mac Allister','Leandro Paredes','Giovani Lo Celso','Lionel Messi','Julián Álvarez','Lautaro Martínez','Ángel Di María','Paulo Dybala'],
  BRA: ['Alisson','Ederson','Marquinhos','Thiago Silva','Éder Militão','Danilo','Alex Sandro','Casemiro','Bruno Guimarães','Lucas Paquetá','Fabinho','Vinícius Jr','Rodrygo','Raphinha','Neymar','Richarlison','Gabriel Jesus','Endrick'],
  COL: ['David Ospina','Camilo Vargas','Davinson Sánchez','Yerry Mina','Daniel Muñoz','Johan Mojica','Santiago Arias','James Rodríguez','Juan Cuadrado','Mateus Uribe','Wílmar Barrios','Jefferson Lerma','Luis Díaz','Radamel Falcao','Duván Zapata','Jhon Durán','Rafael Borré','Jhon Córdoba'],
  ECU: ['Hernán Galíndez','Alexander Domínguez','Piero Hincapié','Félix Torres','Pervis Estupiñán','Ángelo Preciado','William Pacho','Robert Arboleda','Moisés Caicedo','Carlos Gruezo','Sebas Méndez','Ángel Mena','Jeremy Sarmiento','Enner Valencia','Kendry Páez','Gonzalo Plata','Michael Estrada','Djorkaeff Reasco'],
  PAR: ['Antony Silva','Roberto J. Fernández','Gustavo Gómez','Junior Alonso','Omar Alderete','Fabián Balbuena','Robert Rojas','Mathías Villasanti','Andrés Cubas','Damián Bobadilla','Diego Gómez','Miguel Almirón','Julio Enciso','Antonio Sanabria','Adam Bareiro','Ronaldo Martínez','Ramón Sosa','Diego González'],
  URU: ['Sergio Rochet','Sebastián Sosa','José M. Giménez','Ronald Araújo','Sebastián Cáceres','Mathías Olivera','Joaquín Piquerez','Federico Valverde','Manuel Ugarte','Rodrigo Bentancur','Giorgian de Arrascaeta','Nicolás de la Cruz','Darwin Núñez','Maximiliano Araújo','Facundo Pellistri','Luis Suárez','Edinson Cavani','Brian Rodríguez'],
  AUT: ['Heinz Lindner','Patrick Pentz','David Alaba','Stefan Posch','Maximilian Wöber','Kevin Danso','Phillipp Mwene','Konrad Laimer','Florian Grillitsch','Marcel Sabitzer','Xaver Schlager','Christoph Baumgartner','Marko Arnautović','Michael Gregoritsch','Karim Onisiwo','Patrick Wimmer','Romano Schmid','Junior Adamu'],
  BEL: ['Thibaut Courtois','Koen Casteels','Jan Vertonghen','Toby Alderweireld','Arthur Theate','Wout Faes','Timothy Castagne','Thomas Meunier','Kevin De Bruyne','Youri Tielemans','Axel Witsel','Hans Vanaken','Leandro Trossard','Romelu Lukaku','Eden Hazard','Charles De Ketelaere','Jérémy Doku','Yannick Carrasco'],
  CRO: ['Dominik Livaković','Ivica Ivušić','Domagoj Vida','Dejan Lovren','Joško Gvardiol','Borna Sosa','Borna Barišić','Josip Stanišić','Luka Modrić','Mateo Kovačić','Marcelo Brozović','Mario Pašalić','Lovro Majer','Ivan Perišić','Andrej Kramarić','Bruno Petković','Mislav Oršić','Josip Brekalo'],
  CZE: ['Jindřich Staněk','Tomáš Vaclík','Tomáš Souček','Vladimír Coufal','Pavel Kadeřábek','Jakub Brabec','David Zima','Tomáš Holeš','Ladislav Krejčí','Antonín Barák','Lukáš Provod','Adam Hložek','Patrik Schick','Tomáš Chorý','Jan Kuchta','Václav Černý','Mojmír Chytil','Lukáš Masopust'],
  DEN: ['Kasper Schmeichel','Frederik Rønnow','Simon Kjær','Andreas Christensen','Joachim Andersen','Joakim Mæhle','Daniel Wass','Pierre-E. Højbjerg','Christian Eriksen','Thomas Delaney','Mikkel Damsgaard','Andreas Skov Olsen','Mathias Jensen','Jonas Wind','Andreas Cornelius','Yussuf Poulsen','Kasper Dolberg','Rasmus Højlund'],
  ENG: ['Jordan Pickford','Aaron Ramsdale','Harry Maguire','John Stones','Kyle Walker','Luke Shaw','Trent Alexander-Arnold','Reece James','Declan Rice','Jude Bellingham','Phil Foden','Jordan Henderson','Mason Mount','Bukayo Saka','Harry Kane','Marcus Rashford','Raheem Sterling','Cole Palmer'],
  ESP: ['Unai Simón','David Raya','Aymeric Laporte','Pau Torres','Eric García','José Gayà','Jordi Alba','Dani Carvajal','Sergio Busquets','Rodri','Pedri','Gavi','Koke','Marco Asensio','Álvaro Morata','Ferran Torres','Yeremy Pino','Lamine Yamal'],
  FRA: ['Hugo Lloris','Mike Maignan','Raphaël Varane','Dayot Upamecano','William Saliba','Jules Koundé','Theo Hernández','Lucas Hernández','Aurélien Tchouaméni','Eduardo Camavinga','Adrien Rabiot','Antoine Griezmann',"N'Golo Kanté",'Kylian Mbappé','Olivier Giroud','Karim Benzema','Ousmane Dembélé','Marcus Thuram'],
  GER: ['Manuel Neuer','Marc-A. ter Stegen','Antonio Rüdiger','Niklas Süle','Matthias Ginter','Thilo Kehrer','David Raum','Joshua Kimmich','İlkay Gündoğan','Leon Goretzka','Jamal Musiala','Florian Wirtz','Serge Gnabry','Leroy Sané','Thomas Müller','Kai Havertz','Niclas Füllkrug','Timo Werner'],
  ITA: ['G. Donnarumma','Alex Meret','Leonardo Bonucci','Giorgio Chiellini','G. Di Lorenzo','Alessandro Bastoni','Francesco Acerbi','Federico Dimarco','Jorginho','Marco Verratti','Nicolò Barella','Sandro Tonali','Lorenzo Pellegrini','Federico Chiesa','Lorenzo Insigne','Domenico Berardi','Ciro Immobile','Andrea Belotti'],
  NED: ['Jasper Cillessen','Justin Bijlow','Virgil van Dijk','Matthijs de Ligt','Stefan de Vrij','Daley Blind','Denzel Dumfries','Nathan Aké','Frenkie de Jong','Marten de Roon','Steven Berghuis','Davy Klaassen','Cody Gakpo','Memphis Depay','Steven Bergwijn','Donyell Malen','Xavi Simons','Luuk de Jong'],
  NOR: ['Ørjan Nyland','André Hansen','Stefan Strandberg','Kristoffer Ajer','Leo Østigård','Birger Meling','A. Hanche-Olsen','Marcus Pedersen','Sander Berge','Patrick Berg','Martin Ødegaard','Mathias Normann','Fredrik Aursnes','Alexander Sørloth','Erling Haaland','J. Strand Larsen','M. Elyounoussi','Ola Solbakken'],
  POL: ['Wojciech Szczęsny','Łukasz Skorupski','Kamil Glik','Jan Bednarek','B. Bereszyński','Robert Gumny','Tymoteusz Puchacz','Matty Cash','Jakub Kiwior','Krystian Bielik','G. Krychowiak','Piotr Zieliński','Jakub Moder','Sebastian Szymański','Robert Lewandowski','Arkadiusz Milik','Krzysztof Piątek','Karol Świderski'],
  POR: ['Diogo Costa','Rui Patrício','Pepe','Rúben Dias','Danilo Pereira','João Cancelo','Diogo Dalot','Nuno Mendes','Bernardo Silva','Bruno Fernandes','João Palhinha','Vitinha','Rúben Neves','Rafael Leão','Cristiano Ronaldo','João Félix','Diogo Jota','Gonçalo Ramos'],
  SUI: ['Yann Sommer','Gregor Kobel','Manuel Akanji','Nico Elvedi','Fabian Schär','Ricardo Rodríguez','Silvan Widmer','Granit Xhaka','Remo Freuler','Denis Zakaria','Xherdan Shaqiri','Djibril Sow','Fabian Frei','Breel Embolo','Haris Seferović','Noah Okafor','Renato Steffen','Ruben Vargas'],
  UKR: ['Anatoliy Trubin','Andriy Lunin','Mykola Matviyenko','Ilya Zabarnyi','Oleksandr Svatok','Vitaliy Mykolenko','Oleksandr Karavaev','Yukhym Konoplya','Ruslan Malinovskyi','M. Shaparenko','Taras Stepanenko','Heorhiy Sudakov','Oleksandr Zinchenko','Oleksandr Zubkov','Mykhailo Mudryk','Andriy Yarmolenko','Roman Yaremchuk','Artem Dovbyk'],
  CRC: ['Keylor Navas','Patrick Sequeira','Óscar Duarte','Francisco Calvo','Kendall Waston','Bryan Oviedo','Carlos Martínez','Daniel Chacón','Bryan Ruiz','Yeltsin Tejeda','Celso Borges','Gerson Torres','Joel Campbell','Anthony Contreras','Johan Venegas','Jewison Bennette','Brandon Aguilera','Roan Wilson'],
  JAM: ['Andre Blake','Dennis Taylor','Damion Lowe',"Amari'i Bell",'Adrian Mariappa','Greg Leigh','Bobby Reid','Leon Bailey','Michail Antonio','Demarai Gray','Shamar Nicholson','Andre Gray','Cory Burke','Junior Flemmings','Jamal Lowe','Daniel Johnson','Kasey Palmer','Ravel Morrison'],
  PAN: ['Luis Mejía','Orlando Mosquera','Fidel Escobar','Michael Murillo','Eric Davis','Andrés Andrade','Cristian Martínez','A. Carrasquilla','Alberto Quintero','Aníbal Godoy','Edgar Bárcenas','Yoel Bárcenas','Rolando Blackburn','Gabriel Torres','Cecilio Waterman','José Fajardo','Ismael Díaz','Édgar Yoel'],
  AUS: ['Mathew Ryan','Andrew Redmayne','Harry Souttar','Trent Sainsbury','Bailey Wright','Aziz Behich','Joel King','Nathaniel Atkinson','Aaron Mooy','Jackson Irvine','Ajdin Hrustic','Riley McGree','Awer Mabil','Mathew Leckie','Mitchell Duke','Jamie Maclaren','Jason Cummings','Craig Goodwin'],
  IRN: ['Alireza Beiranvand','Amir Abedzadeh','Hossein Hosseini','Sadegh Moharrami','M. Pouraliganji','Shojae Khalilzadeh','Milad Mohammadi','Ehsan Hajsafi','Ramin Rezaeian','Saman Ghoddos','Ahmad Nourollahi','Saeid Ezatolahi','Alireza Jahanbakhsh','Mehdi Taremi','Sardar Azmoun','Karim Ansarifard','Mehdi Torabi','Ali Gholizadeh'],
  IRQ: ['Jalal Hassan','Fahad Talib','Rebin Sulaka','Manaf Younis','Ahmed Ibrahim','Ali Adnan','Hussein Ali','Bashar Resan','Ibrahim Bayesh','Amir Al-Ammari','Mohammed Qassim','Osama Rashid','Aymen Hussein','Mohanad Ali','Hussein A. Talib','Ali Al-Hamadi','Mohammed Saad','Zaid Tahseen'],
  JPN: ['Shuichi Gonda','Eiji Kawashima','Daniel Schmidt','Maya Yoshida','Takehiro Tomiyasu','Hiroki Sakai','Yuto Nagatomo','Ko Itakura','Shogo Taniguchi','Wataru Endo','Hidemasa Morita','Junya Ito','Daichi Kamada','Takefusa Kubo','Ritsu Doan','Takuma Asano','Daizen Maeda','Ayase Ueda'],
  KOR: ['Kim Seung-gyu','Jo Hyeon-woo','Kim Min-jae','Kim Young-gwon','Hong Chul','Lee Jae-sung','Kim Moon-hwan','Kim Jin-su','Hwang In-beom','Jeong Woo-yeong','Lee Kang-in','Son Heung-min','Hwang Hee-chan','Cho Gue-sung','Hwang Ui-jo','Na Sang-ho','Paik Seung-ho','Jung Woo-young'],
  QAT: ['Saad Al-Sheeb','Meshaal Barsham','Yousef Hassan','Boualem Khoukhi','Bassam Al-Rawi','Tarek Salman','Pedro Miguel','Homam Ahmed','Abdelkarim Hassan','Karim Boudiaf','Salem Al Hajri','Hassan Al-Haydos','Ali Assadalla','M. Muntari','Akram Afif','Almoez Ali','Ismaeel Mohammad','A. Alaaeldin'],
  SAU: ['Mohammed Al-Owais','Mohammed Al-Yami','Yasser Al-Shahrani','Saud Abdulhamid','Hassan Tambakti','Ali Al-Bulayhi','A. Al-Amri','Mohammed Al-Burayk','Ali Al-Hassan','Salman Al-Faraj','Mohamed Kanno','A. Al-Malki','Salem Al-Dawsari','Hattan Bahebri','Saleh Al-Shehri','Firas Al-Buraikan','Saud Abdulaziz','S. Al-Ghannam'],
  UAE: ['Khalid Eisa','Mohammed Al Shamsi','K. Al Hammadi','Walid Abbas','S. Abdulrahman','Bandar Al Ahbabi','Khalifa Mubarak','Mahmoud Khamis','Yousif Jaber','Tahnoon Al Zaabi','Abdullah Ramadan','Ali Saleh','Caio Canedo','Fabio De Lima','Ali Mabkhout','S. Tagliabúe','Yahya Al Ghassani','Harib Abdalla'],
  ALG: ["Raïs M'Bolhi",'Alexandre Oukidja','Aïssa Mandi','Ramy Bensebaini','Djamel Benlamri','Youcef Atal','Mohamed Farès','Rafik Guitane','Sofiane Feghouli','Adlene Guedioura','Ismaël Bennacer','Houssem Aouar','Riyad Mahrez','Saïd Benrahma','Yacine Brahimi','Islam Slimani','Baghdad Bounedjah','Andy Delort'],
  CIV: ['Yahia Fofana','Badra Ali Sangaré','Eric Bailly','Wilfried Singo','Ghislain Konan','Serge Aurier','Odilon Kossounou','Willy Boly','Jean Michaël Seri','Franck Kessié','Ibrahim Sangaré','Yacine Diomandé','Sébastien Haller','Wilfried Zaha','Nicolas Pépé','Jérémie Boga','Maxwel Cornet','Jonathan Bamba'],
  CMR: ['André Onana','Devis Epassy','S. Ngapandouetnbu','Nicolas Nkoulou','Jean-C. Castelletto','Olivier Mbaizo','Collins Fai','Enzo Ebosse','Tolo Nouhou','Z. Anguissa','Pierre Kunde','Samuel Gouet','Karl Toko Ekambi','Vincent Aboubakar','Choupo-Moting','Bryan Mbeumo','G.-K. Nkoudou','Jean-P. Nsame'],
  EGY: ['Mohamed El Shenawy','M. Abou Gabal','M. Abdelmonem','Ahmed Hegazi','Mohamed Hamdy','Ahmed Fattouh','Omar Kamal','Akram Tawfik','Mohamed Elneny','Tarek Hamed','Hamdy Fathy','Mahmoud Trezeguet','Mostafa Mohamed','Mohamed Salah','Marwan Hamdy','Ahmed Sayed Zizo','Omar Marmoush','Ibrahim Adel'],
  GHA: ['Lawrence Ati-Zigi','Joe Wollacott','Daniel Amartey','M. Salisu','Alexander Djiku','Tariq Lamptey','Gideon Mensah','Baba Rahman','Denis Odoi','Thomas Partey','Mohammed Kudus','André Ayew','Daniel-K. Kyereh','Jordan Ayew','Iñaki Williams','Antoine Semenyo','Felix Afena-Gyan','Osman Bukari'],
  MAR: ['Yassine Bounou','Munir Mohamedi','Achraf Hakimi','Romain Saïss','Nayef Aguerd','Noussair Mazraoui','Yahia Attiyat Allah','Achraf Dari','Jawad El Yamiq','Sofyan Amrabat','Selim Amallah','Azzedine Ounahi','Bilal El Khannouss','Hakim Ziyech','Youssef En-Nesyri','Sofiane Boufal','Zakaria Aboukhlal','Ilias Chair'],
  NGA: ['Maduka Okoye','Francis Uzoho','Stanley Nwabali','William Troost-Ekong','Kenneth Omeruo','Calvin Bassey','Ola Aina','Zaidu Sanusi','Bright Osayi-Samuel','Wilfred Ndidi','Frank Onyeka','Alex Iwobi','Joe Aribo','Samuel Chukwueze','Ademola Lookman','Victor Osimhen','Kelechi Iheanacho','Moses Simon'],
  SEN: ['Édouard Mendy','Alfred Gomis','Seny Dieng','Kalidou Koulibaly','Abdou Diallo','Pape Abou Cissé','Saliou Ciss','Youssouf Sabaly','Fodé Ballo-Touré','I. Gana Gueye','Cheikhou Kouyaté','Pape Matar Sarr','Pape Gueye','Sadio Mané','Krépin Diatta','Boulaye Dia','Famara Diédhiou','Ismaila Sarr'],
  TUN: ['Aymen Dahmen','Bechir Ben Saïd','Mouez Hassen','Yassine Meriah','Dylan Bronn','Montassar Talbi','Ali Maâloul','Mohamed Dräger','Wajdi Kechrida','Aïssa Laïdouni','Ferjani Sassi','Ellyes Skhiri','Hannibal Mejbri','Naïm Sliti','Wahbi Khazri','Youssef Msakni','Issam Jebali','Anis Ben Slimane'],
  NZL: ['Oliver Sail','Max Crocombe','Nando Pijnaker','Tim Payne','Liberato Cacace','Tyler Bindon','Francis de Vries','Bill Tuiloma','Joe Bell','Marko Stamenić','Matthew Garbett','Sarpreet Singh','Alex Greive','Chris Wood','Ben Old','Eli Just','Kosta Barbarouses','Elijah Just'],
  PER: ['Pedro Gallese','José Carvallo','Carlos Zambrano','Luis Abram','Alexander Callens','Renato Tapia','Aldo Corzo','Marcos López','Luis Advíncula','Wilder Cartagena','Yoshimar Yotún','Christian Cueva','Edison Flores','Christofer Gonzales','Bryan Reyna','Paolo Guerrero','Gianluca Lapadula','André Carrillo'],
  SWE: ['Robin Olsen','Kristoffer Nordfeldt','Victor Lindelöf','Pontus Jansson','Marcus Danielson','Joakim Nilsson','L. Augustinsson','Emil Krafth','Mikael Lustig','Albin Ekdal','Kristoffer Olsson','Mattias Svanberg','Sebastian Larsson','Dejan Kulusevski','Emil Forsberg','Alexander Isak','Robin Quaison','Marcus Berg'],
};

// 20 figurinhas por seleção: #1 escudo, #2 foto da equipe, #3-#20 jogadores
export const STICKERS_PER_TEAM = 20;

// 19 figurinhas FWC especiais (FWC-1 a FWC-19)
export const FWC_STICKERS = [
  { name: 'Emblema FIFA WC 26', tag: 'OFICIAL' },
  { name: 'Slogan Oficial',     tag: 'OFICIAL' },
  { name: 'Bola Trionda',       tag: 'OFICIAL' },
  { name: 'Maple 🇨🇦',           tag: 'MASCOTE' },
  { name: 'Zayu 🇲🇽',            tag: 'MASCOTE' },
  { name: 'Clutch 🇺🇸',          tag: 'MASCOTE' },
  { name: 'Emblema Canadá',     tag: 'SEDE' },
  { name: 'Emblema México',     tag: 'SEDE' },
  { name: 'Emblema EUA',        tag: 'SEDE' },
  { name: 'Maracanazo 1950',    tag: 'MOMENTO' },
  { name: 'Pelé Rei 1958',      tag: 'MOMENTO' },
  { name: 'Brasil Tri 1970',    tag: 'MOMENTO' },
  { name: 'Carlos Alberto 1970',tag: 'MOMENTO' },
  { name: 'Mão de Deus 1986',   tag: 'MOMENTO' },
  { name: 'Iniesta 2010',       tag: 'MOMENTO' },
  { name: 'Götze 2014',         tag: 'MOMENTO' },
  { name: 'Mbappé 2018',        tag: 'MOMENTO' },
  { name: 'Messi Campeão 2022', tag: 'MOMENTO' },
  { name: 'Final em NJ 2026',   tag: 'MOMENTO' },
];

export const SPECIAL_SECTIONS = [
  { id: 'FWC', name: 'FWC Especiais', icon: '🏆', count: 19, desc: 'Mascotes, emblemas, bola, momentos' },
];

const TAG_COLORS = {
  ESCUDO:  '#d4a437',
  FOTO:    '#1a5634',
  OFICIAL: '#0d3520',
  MASCOTE: '#c1272d',
  SEDE:    '#1a5634',
  MOMENTO: '#8a6a1f',
};

export const CONF_LABELS = {
  CONCACAF: 'CONCACAF', CONMEBOL: 'CONMEBOL', UEFA: 'UEFA',
  AFC: 'AFC', CAF: 'CAF', OFC: 'OFC', REPESCAGEM: 'Repescagem',
};
export const CONF_ORDER = ['CONCACAF', 'CONMEBOL', 'UEFA', 'AFC', 'CAF', 'OFC', 'REPESCAGEM'];

const TOTAL_TEAM_STICKERS = TEAMS.length * STICKERS_PER_TEAM;
const TOTAL_SPECIAL_STICKERS = SPECIAL_SECTIONS.reduce((s, x) => s + x.count, 0);
export const TOTAL_STICKERS = TOTAL_TEAM_STICKERS + TOTAL_SPECIAL_STICKERS;

// ============================ HELPERS ============================

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function generateCode() {
  return Array.from({ length: 6 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
}

export const stickerKey = (prefix, num) => `${prefix}-${num}`;

export function getStickerInfo(prefix, num) {
  const team = TEAMS.find(t => t.code === prefix);
  if (team) {
    if (num === 1) return { name: team.name, tag: 'ESCUDO', tagColor: TAG_COLORS.ESCUDO };
    if (num === 2) return { name: 'Foto da Equipe', tag: 'FOTO', tagColor: TAG_COLORS.FOTO };
    const player = TEAM_PLAYERS[prefix]?.[num - 3] || `Jogador ${num - 2}`;
    return { name: player, tag: '' };
  }
  if (prefix === 'FWC') {
    const s = FWC_STICKERS[num - 1];
    if (!s) return { name: '', tag: '' };
    return { name: s.name, tag: s.tag, tagColor: TAG_COLORS[s.tag] };
  }
  return { name: '', tag: '' };
}

export const getStickerStatus = (album, key) =>
  (album?.stickers?.[key]) || { count: 0 };

export function teamProgress(album, teamCode) {
  let have = 0, dupes = 0;
  for (let i = 1; i <= STICKERS_PER_TEAM; i++) {
    const s = getStickerStatus(album, stickerKey(teamCode, i));
    if (s.count > 0) have++;
    if (s.count > 1) dupes += s.count - 1;
  }
  return { have, total: STICKERS_PER_TEAM, dupes };
}

export function sectionProgress(album, sectionId, count) {
  let have = 0, dupes = 0;
  for (let i = 1; i <= count; i++) {
    const s = getStickerStatus(album, stickerKey(sectionId, i));
    if (s.count > 0) have++;
    if (s.count > 1) dupes += s.count - 1;
  }
  return { have, total: count, dupes };
}

export function totalProgress(album) {
  let have = 0, dupes = 0;
  TEAMS.forEach(t => {
    const p = teamProgress(album, t.code);
    have += p.have; dupes += p.dupes;
  });
  SPECIAL_SECTIONS.forEach(s => {
    const p = sectionProgress(album, s.id, s.count);
    have += p.have; dupes += p.dupes;
  });
  return { have, total: TOTAL_STICKERS, dupes, missing: TOTAL_STICKERS - have };
}
