export const timeZones = [
    'America/Adak', 'America/Anchorage', 'America/Anguilla', 'America/Antigua',
    'America/Araguaina', 'America/Argentina/Buenos_Aires', 'America/Argentina/Catamarca',
    'America/Argentina/ComodRivadavia', 'America/Argentina/Cordoba',
    'America/Argentina/Jujuy', 'America/Argentina/La_Rioja', 'America/Argentina/Mendoza',
    'America/Argentina/Rio_Gallegos', 'America/Argentina/Salta', 'America/Argentina/San_Juan',
    'America/Argentina/San_Luis', 'America/Argentina/Tucuman', 'America/Argentina/Ushuaia',
    'America/Aruba', 'America/Asuncion', 'America/Atikokan', 'America/Atka', 'America/Bahia',
    'America/Bahia_Banderas', 'America/Barbados', 'America/Belem', 'America/Belize',
    'America/Blanc-Sablon', 'America/Boa_Vista', 'America/Bogota', 'America/Boise',
    'America/Buenos_Aires', 'America/Cambridge_Bay', 'America/Campo_Grande', 'America/Cancun',
    'America/Caracas', 'America/Catamarca', 'America/Cayenne', 'America/Cayman', 'America/Chicago',
    'America/Chihuahua', 'America/Coral_Harbour', 'America/Cordoba', 'America/Costa_Rica',
    'America/Creston', 'America/Cuiaba', 'America/Curacao', 'America/Danmarkshavn', 'America/Dawson',
    'America/Dawson_Creek', 'America/Denver', 'America/Detroit', 'America/Dominica', 'America/Edmonton',
    'America/Eirunepe', 'America/El_Salvador', 'America/Ensenada', 'America/Fort_Wayne', 'America/Fortaleza',
    'America/Glace_Bay', 'America/Godthab', 'America/Goose_Bay', 'America/Grand_Turk', 'America/Grenada',
    'America/Guadeloupe', 'America/Guatemala', 'America/Guayaquil', 'America/Guyana', 'America/Halifax',
    'America/Havana', 'America/Hermosillo', 'America/Indiana/Indianapolis', 'America/Indiana/Knox',
    'America/Indiana/Marengo', 'America/Indiana/Petersburg', 'America/Indiana/Tell_City',
    'America/Indiana/Vevay', 'America/Indiana/Vincennes', 'America/Indiana/Winamac', 'America/Indianapolis',
    'America/Inuvik', 'America/Iqaluit', 'America/Jamaica', 'America/Jujuy', 'America/Juneau',
    'America/Kentucky/Louisville', 'America/Kentucky/Monticello', 'America/Knox_IN', 'America/Kralendijk',
    'America/La_Paz', 'America/Lima', 'America/Los_Angeles', 'America/Louisville', 'America/Lower_Princes',
    'America/Maceio', 'America/Managua', 'America/Manaus', 'America/Marigot', 'America/Martinique',
    'America/Matamoros', 'America/Mazatlan', 'America/Mendoza', 'America/Menominee', 'America/Merida',
    'America/Metlakatla', 'America/Mexico_City', 'America/Miquelon', 'America/Moncton', 'America/Monterrey',
    'America/Montevideo', 'America/Montreal', 'America/Montserrat', 'America/Nassau', 'America/New_York',
    'America/Nipigon', 'America/Nome', 'America/Noronha', 'America/North_Dakota/Beulah',
    'America/North_Dakota/Center', 'America/North_Dakota/New_Salem', 'America/Ojinaga', 'America/Panama',
    'America/Pangnirtung', 'America/Paramaribo', 'America/Phoenix', 'America/Port-au-Prince',
    'America/Port_of_Spain', 'America/Porto_Acre', 'America/Porto_Velho', 'America/Puerto_Rico',
    'America/Rainy_River', 'America/Rankin_Inlet', 'America/Recife', 'America/Regina', 'America/Resolute',
    'America/Rio_Branco', 'America/Rosario', 'America/Santa_Isabel', 'America/Santarem', 'America/Santiago',
    'America/Santo_Domingo', 'America/Sao_Paulo', 'America/Scoresbysund', 'America/Shiprock',
    'America/Sitka', 'America/St_Barthelemy', 'America/St_Johns', 'America/St_Kitts', 'America/St_Lucia',
    'America/St_Thomas', 'America/St_Vincent', 'America/Swift_Current', 'America/Tegucigalpa',
    'America/Thule', 'America/Thunder_Bay', 'America/Tijuana', 'America/Toronto', 'America/Tortola',
    'America/Vancouver', 'America/Virgin', 'America/Whitehorse', 'America/Winnipeg', 'America/Yakutat',
    'America/Yellowknife', 'Asia/Kolkata', 'Asia/Calcutta', 'Atlantic/Azores', 'Atlantic/Bermuda',
    'Atlantic/Canary', 'Atlantic/Cape_Verde', 'Atlantic/Faeroe', 'Atlantic/Faroe', 'Atlantic/Jan_Mayen',
    'Atlantic/Madeira', 'Atlantic/Reykjavik', 'Atlantic/South_Georgia', 'Atlantic/St_Helena',
    'Atlantic/Stanley', 'Brazil/Acre', 'Brazil/DeNoronha', 'Brazil/East', 'Brazil/West', 'Canada/Atlantic',
    'Canada/Central', 'Canada/East-Saskatchewan', 'Canada/Eastern', 'Canada/Mountain', 'Canada/Newfoundland',
    'Canada/Pacific', 'Canada/Saskatchewan', 'Canada/Yukon', 'Chile/Continental', 'Chile/EasterIsland',
    'Cuba', 'EST', 'Indian/Reunion', 'Jamaica', 'Mexico/BajaNorte', 'Mexico/BajaSur', 'Mexico/General',
    'Pacific/Guam', 'Pacific/Honolulu', 'Turkey', 'UCT', 'US/Alaska', 'US/Aleutian', 'US/Arizona',
    'US/Central', 'US/East-Indiana', 'US/Eastern', 'US/Hawaii', 'US/Indiana-Starke', 'US/Michigan',
    'US/Mountain', 'US/Pacific', 'US/Pacific-New', 'US/Samoa', 'UTC'
  ];

export const timeZonesDetails = [
    {
      country: 'US',
      zones: [
        {
          utc_diff: 'UTC -10',
          java_code: 'Pacific/Honolulu',
          abbr: 'HAST',
          abbr_full: 'Hawaii-Aleutian Standard Time',
          location: 'Honolulu'
        },
        {
          utc_diff: 'UTC -9',
          java_code: 'America/Anchorage',
          abbr: 'AKST',
          abbr_full: 'Alaska Standard Time',
          location: 'Anchorage'
        },
        {
          utc_diff: 'UTC -8',
          java_code: 'America/Los_Angeles',
          abbr: 'PST',
          abbr_full: 'Pacific Standard Time',
          location: 'Los Angeles'
        },
        {
          utc_diff: 'UTC -7',
          java_code: 'MST',
          abbr: 'MST',
          abbr_full: 'Mountain Standard Time',
          location: 'Salt Lake City'
        },
        {
          utc_diff: 'UTC -6',
          java_code: 'America/Chicago',
          abbr: 'CST',
          abbr_full: 'Central Standard Time',
          location: 'Chicago'
        },
        {
          utc_diff: 'UTC -5',
          java_code: 'America/New_York',
          abbr: 'EST',
          abbr_full: 'Eastern Standard Time',
          location: 'New York'
        }
      ]
    },
    {
      country: 'Mexico',
       zones: [
         {
          utc_diff: 'UTC -8',
          java_code: 'America/Tijuana',
          abbr: 'PST',
          abbr_full: 'Pacific Standard Time',
          location: 'Tijuana'
         },
         {
          utc_diff: 'UTC -7',
          java_code: 'America/Hermosillo',
          abbr: 'MST',
          abbr_full: 'Mountain Standard Time',
          location: 'Hermosillo'
         },
         {
          utc_diff: 'UTC -6',
          java_code: 'America/Mexico_City',
          abbr: 'CST',
          abbr_full: 'Central Standard Time',
          location: 'Mexico City'
         },
         {
          utc_diff: 'UTC -5',
          java_code: 'America/Cancun',
          abbr: 'EST',
          abbr_full: 'Eastern Standard Time',
          location: 'Cancún'
         }
       ]
    },
    {
      country: 'Brazil',
      zones: [
         {
          utc_diff: 'UTC -5',
          java_code: 'Brazil/Acre',
          abbr: 'ACT',
          abbr_full: 'Acre Time',
          location: 'Rio Branco'
         },
         {
          utc_diff: 'UTC -4',
          java_code: 'America/Manaus',
          abbr: 'AMT',
          abbr_full: 'Amazon Time Manaus',
          location: 'Manaus'
         },
         {
          utc_diff: 'UTC -3',
          java_code: 'America/Sao_Paulo',
          abbr: 'BRT',
          abbr_full: 'Brasília Time',
          location: 'São Paulo'
         },
         {
          utc_diff: 'UTC -2',
          java_code: 'Brazil/DeNoronha',
          abbr: 'FNT',
          abbr_full: 'Fernando de Noronha Time',
          location: 'Fernando de Noronha'
         },
         {
          utc_diff: 'UTC -3',
          java_code: 'America/Cuiaba',
          abbr: 'AMST',
          abbr_full: 'Amazon Summer Time',
          location: 'Fernando de Noronha'
         },
         {
          utc_diff: 'UTC -2',
          java_code: 'America/Sao_Paulo',
          abbr: 'BRST',
          abbr_full: 'Brasília Summer Time',
          location: 'Sao_Paulo'
         }
       ]
    },
    {
      country: 'Colombia',
      zones: [
         {
          utc_diff: 'UTC -5',
          java_code: 'America/Bogota',
          abbr: 'COT',
          abbr_full: 'Colombia Time',
          location: 'Bogota'
         }
       ]
    },
    {
      country: 'Ecuador',
      zones: [
        {
          utc_diff: 'UTC -5',
          java_code: 'America/Guayaquil',
          abbr: 'ECT',
          abbr_full: 'Ecuador Time',
          location: 'Quito'
        }
      ]
    },
    {
      country: 'Chile',
      zones: [
        {
          utc_diff: 'UTC -4',
          java_code: 'Chile/Continental',
          abbr: 'CLT',
          abbr_full: 'Chile Standard Time',
          location: 'Santiago'
        }
      ]
    },
    {
      country: 'India',
      zones: [
        {
          utc_diff: 'UTC +5.30',
          java_code: 'Asia/Kolkata',
          abbr: 'IST',
          abbr_full: 'Indian Standard Time',
          location: 'Kolkata'
         },
         {
          utc_diff: 'UTC +5.30',
          java_code: 'Asia/Calcutta',
          abbr: 'IST',
          abbr_full: 'Indian Standard Time',
          location: 'Calcutta'
         }
      ]
    }
  ];
