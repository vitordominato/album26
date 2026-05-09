import type { Team } from '@/types';

/**
 * As 48 seleções da Copa do Mundo FIFA 2026.
 * Os 3 anfitriões (USA, MEX, CAN) já estão classificados; demais foram preenchidos
 * com as seleções tradicionalmente fortes — ajuste após o término das eliminatórias.
 */

const flag = (code: string) => `https://flagcdn.com/w320/${code.toLowerCase()}.png`;

export const TEAMS_SEED: Team[] = [
  // CONCACAF (anfitriões)
  { id: 'CAN', code: 'CAN', namePt: 'Canadá', nameEn: 'Canada', nameEs: 'Canadá', flagUrl: flag('ca'), confederation: 'CONCACAF', isHost: true, order: 1 },
  { id: 'MEX', code: 'MEX', namePt: 'México', nameEn: 'Mexico', nameEs: 'México', flagUrl: flag('mx'), confederation: 'CONCACAF', isHost: true, order: 2 },
  { id: 'USA', code: 'USA', namePt: 'Estados Unidos', nameEn: 'United States', nameEs: 'Estados Unidos', flagUrl: flag('us'), confederation: 'CONCACAF', isHost: true, order: 3 },

  // CONMEBOL (6)
  { id: 'ARG', code: 'ARG', namePt: 'Argentina', nameEn: 'Argentina', nameEs: 'Argentina', flagUrl: flag('ar'), confederation: 'CONMEBOL', isHost: false, order: 10 },
  { id: 'BRA', code: 'BRA', namePt: 'Brasil', nameEn: 'Brazil', nameEs: 'Brasil', flagUrl: flag('br'), confederation: 'CONMEBOL', isHost: false, order: 11 },
  { id: 'COL', code: 'COL', namePt: 'Colômbia', nameEn: 'Colombia', nameEs: 'Colombia', flagUrl: flag('co'), confederation: 'CONMEBOL', isHost: false, order: 12 },
  { id: 'URU', code: 'URU', namePt: 'Uruguai', nameEn: 'Uruguay', nameEs: 'Uruguay', flagUrl: flag('uy'), confederation: 'CONMEBOL', isHost: false, order: 13 },
  { id: 'ECU', code: 'ECU', namePt: 'Equador', nameEn: 'Ecuador', nameEs: 'Ecuador', flagUrl: flag('ec'), confederation: 'CONMEBOL', isHost: false, order: 14 },
  { id: 'PAR', code: 'PAR', namePt: 'Paraguai', nameEn: 'Paraguay', nameEs: 'Paraguay', flagUrl: flag('py'), confederation: 'CONMEBOL', isHost: false, order: 15 },

  // UEFA (16)
  { id: 'ENG', code: 'ENG', namePt: 'Inglaterra', nameEn: 'England', nameEs: 'Inglaterra', flagUrl: flag('gb-eng'), confederation: 'UEFA', isHost: false, order: 20 },
  { id: 'FRA', code: 'FRA', namePt: 'França', nameEn: 'France', nameEs: 'Francia', flagUrl: flag('fr'), confederation: 'UEFA', isHost: false, order: 21 },
  { id: 'ESP', code: 'ESP', namePt: 'Espanha', nameEn: 'Spain', nameEs: 'España', flagUrl: flag('es'), confederation: 'UEFA', isHost: false, order: 22 },
  { id: 'GER', code: 'GER', namePt: 'Alemanha', nameEn: 'Germany', nameEs: 'Alemania', flagUrl: flag('de'), confederation: 'UEFA', isHost: false, order: 23 },
  { id: 'POR', code: 'POR', namePt: 'Portugal', nameEn: 'Portugal', nameEs: 'Portugal', flagUrl: flag('pt'), confederation: 'UEFA', isHost: false, order: 24 },
  { id: 'NED', code: 'NED', namePt: 'Holanda', nameEn: 'Netherlands', nameEs: 'Países Bajos', flagUrl: flag('nl'), confederation: 'UEFA', isHost: false, order: 25 },
  { id: 'ITA', code: 'ITA', namePt: 'Itália', nameEn: 'Italy', nameEs: 'Italia', flagUrl: flag('it'), confederation: 'UEFA', isHost: false, order: 26 },
  { id: 'BEL', code: 'BEL', namePt: 'Bélgica', nameEn: 'Belgium', nameEs: 'Bélgica', flagUrl: flag('be'), confederation: 'UEFA', isHost: false, order: 27 },
  { id: 'CRO', code: 'CRO', namePt: 'Croácia', nameEn: 'Croatia', nameEs: 'Croacia', flagUrl: flag('hr'), confederation: 'UEFA', isHost: false, order: 28 },
  { id: 'SUI', code: 'SUI', namePt: 'Suíça', nameEn: 'Switzerland', nameEs: 'Suiza', flagUrl: flag('ch'), confederation: 'UEFA', isHost: false, order: 29 },
  { id: 'DEN', code: 'DEN', namePt: 'Dinamarca', nameEn: 'Denmark', nameEs: 'Dinamarca', flagUrl: flag('dk'), confederation: 'UEFA', isHost: false, order: 30 },
  { id: 'POL', code: 'POL', namePt: 'Polônia', nameEn: 'Poland', nameEs: 'Polonia', flagUrl: flag('pl'), confederation: 'UEFA', isHost: false, order: 31 },
  { id: 'AUT', code: 'AUT', namePt: 'Áustria', nameEn: 'Austria', nameEs: 'Austria', flagUrl: flag('at'), confederation: 'UEFA', isHost: false, order: 32 },
  { id: 'TUR', code: 'TUR', namePt: 'Turquia', nameEn: 'Türkiye', nameEs: 'Turquía', flagUrl: flag('tr'), confederation: 'UEFA', isHost: false, order: 33 },
  { id: 'SRB', code: 'SRB', namePt: 'Sérvia', nameEn: 'Serbia', nameEs: 'Serbia', flagUrl: flag('rs'), confederation: 'UEFA', isHost: false, order: 34 },
  { id: 'WAL', code: 'WAL', namePt: 'País de Gales', nameEn: 'Wales', nameEs: 'Gales', flagUrl: flag('gb-wls'), confederation: 'UEFA', isHost: false, order: 35 },

  // CAF (9)
  { id: 'MAR', code: 'MAR', namePt: 'Marrocos', nameEn: 'Morocco', nameEs: 'Marruecos', flagUrl: flag('ma'), confederation: 'CAF', isHost: false, order: 40 },
  { id: 'SEN', code: 'SEN', namePt: 'Senegal', nameEn: 'Senegal', nameEs: 'Senegal', flagUrl: flag('sn'), confederation: 'CAF', isHost: false, order: 41 },
  { id: 'EGY', code: 'EGY', namePt: 'Egito', nameEn: 'Egypt', nameEs: 'Egipto', flagUrl: flag('eg'), confederation: 'CAF', isHost: false, order: 42 },
  { id: 'NGA', code: 'NGA', namePt: 'Nigéria', nameEn: 'Nigeria', nameEs: 'Nigeria', flagUrl: flag('ng'), confederation: 'CAF', isHost: false, order: 43 },
  { id: 'ALG', code: 'ALG', namePt: 'Argélia', nameEn: 'Algeria', nameEs: 'Argelia', flagUrl: flag('dz'), confederation: 'CAF', isHost: false, order: 44 },
  { id: 'TUN', code: 'TUN', namePt: 'Tunísia', nameEn: 'Tunisia', nameEs: 'Túnez', flagUrl: flag('tn'), confederation: 'CAF', isHost: false, order: 45 },
  { id: 'CIV', code: 'CIV', namePt: 'Costa do Marfim', nameEn: 'Ivory Coast', nameEs: 'Costa de Marfil', flagUrl: flag('ci'), confederation: 'CAF', isHost: false, order: 46 },
  { id: 'CMR', code: 'CMR', namePt: 'Camarões', nameEn: 'Cameroon', nameEs: 'Camerún', flagUrl: flag('cm'), confederation: 'CAF', isHost: false, order: 47 },
  { id: 'GHA', code: 'GHA', namePt: 'Gana', nameEn: 'Ghana', nameEs: 'Ghana', flagUrl: flag('gh'), confederation: 'CAF', isHost: false, order: 48 },

  // AFC (8)
  { id: 'JPN', code: 'JPN', namePt: 'Japão', nameEn: 'Japan', nameEs: 'Japón', flagUrl: flag('jp'), confederation: 'AFC', isHost: false, order: 50 },
  { id: 'KOR', code: 'KOR', namePt: 'Coreia do Sul', nameEn: 'South Korea', nameEs: 'Corea del Sur', flagUrl: flag('kr'), confederation: 'AFC', isHost: false, order: 51 },
  { id: 'AUS', code: 'AUS', namePt: 'Austrália', nameEn: 'Australia', nameEs: 'Australia', flagUrl: flag('au'), confederation: 'AFC', isHost: false, order: 52 },
  { id: 'IRN', code: 'IRN', namePt: 'Irã', nameEn: 'Iran', nameEs: 'Irán', flagUrl: flag('ir'), confederation: 'AFC', isHost: false, order: 53 },
  { id: 'KSA', code: 'KSA', namePt: 'Arábia Saudita', nameEn: 'Saudi Arabia', nameEs: 'Arabia Saudita', flagUrl: flag('sa'), confederation: 'AFC', isHost: false, order: 54 },
  { id: 'QAT', code: 'QAT', namePt: 'Catar', nameEn: 'Qatar', nameEs: 'Catar', flagUrl: flag('qa'), confederation: 'AFC', isHost: false, order: 55 },
  { id: 'IRQ', code: 'IRQ', namePt: 'Iraque', nameEn: 'Iraq', nameEs: 'Iraq', flagUrl: flag('iq'), confederation: 'AFC', isHost: false, order: 56 },
  { id: 'UZB', code: 'UZB', namePt: 'Uzbequistão', nameEn: 'Uzbekistan', nameEs: 'Uzbekistán', flagUrl: flag('uz'), confederation: 'AFC', isHost: false, order: 57 },

  // CONCACAF (3 não-anfitriões)
  { id: 'CRC', code: 'CRC', namePt: 'Costa Rica', nameEn: 'Costa Rica', nameEs: 'Costa Rica', flagUrl: flag('cr'), confederation: 'CONCACAF', isHost: false, order: 60 },
  { id: 'PAN', code: 'PAN', namePt: 'Panamá', nameEn: 'Panama', nameEs: 'Panamá', flagUrl: flag('pa'), confederation: 'CONCACAF', isHost: false, order: 61 },
  { id: 'JAM', code: 'JAM', namePt: 'Jamaica', nameEn: 'Jamaica', nameEs: 'Jamaica', flagUrl: flag('jm'), confederation: 'CONCACAF', isHost: false, order: 62 },

  // OFC (1)
  { id: 'NZL', code: 'NZL', namePt: 'Nova Zelândia', nameEn: 'New Zealand', nameEs: 'Nueva Zelanda', flagUrl: flag('nz'), confederation: 'OFC', isHost: false, order: 70 },

  // 2 vagas de repescagem intercontinental — placeholder
  { id: 'PR1', code: 'PR1', namePt: 'Repescagem 1', nameEn: 'Playoff 1', nameEs: 'Repechaje 1', flagUrl: flag('un'), confederation: 'CONMEBOL', isHost: false, order: 90 },
  { id: 'PR2', code: 'PR2', namePt: 'Repescagem 2', nameEn: 'Playoff 2', nameEs: 'Repechaje 2', flagUrl: flag('un'), confederation: 'AFC', isHost: false, order: 91 },
];

export function getTeamById(id: string): Team | undefined {
  return TEAMS_SEED.find((t) => t.id === id);
}
