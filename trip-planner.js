(() => {
  "use strict";

  const CATEGORIES = {
    landmarks: "ღირსშესანიშნაობა",
    museums: "მუზეუმი",
    food: "კულინარია",
    music: "მუსიკა",
    parks: "პარკი",
    shopping: "შოპინგი",
    sports: "სპორტი",
    nightlife: "ღამის ცხოვრება",
    family: "ოჯახური",
    events: "ღონისძიება"
  };

  const CITY_GUIDES = {
    "new-york": {
      nameKa: "ნიუ-იორკი",
      nameEn: "New York City",
      activities: [
        a("Statue of Liberty & Ellis Island", "landmarks", "Lower Manhattan", "ბორანით თავისუფლების ქანდაკება და ემიგრაციის მუზეუმი.", "3–4 სთ", "$$"),
        a("Wall Street & Charging Bull", "landmarks", "Lower Manhattan", "ფინანსური უბნის მთავარი ადგილები ფეხით.", "1 სთ", "$"),
        a("9/11 Memorial & Museum", "museums", "Lower Manhattan", "მემორიალი და მუზეუმი წინასწარი ბილეთით.", "2–3 სთ", "$$"),
        a("Brooklyn Bridge & DUMBO", "landmarks", "Downtown Brooklyn", "ხიდზე გასეირნება და Manhattan Bridge-ის ცნობილი ხედები.", "2 სთ", "$"),
        a("Brooklyn Heights Promenade", "parks", "Downtown Brooklyn", "მანჰეტენის პანორამა მშვიდი გასეირნებისთვის.", "1–1.5 სთ", "$"),
        a("Times Square", "landmarks", "Midtown", "საღამოს განათებები და ცენტრალური მანჰეტენის ატმოსფერო.", "1 სთ", "$"),
        a("Top of the Rock", "landmarks", "Midtown", "Empire State Building-ის საუკეთესო პანორამული ხედი.", "1.5 სთ", "$$"),
        a("Museum of Modern Art (MoMA)", "museums", "Midtown", "თანამედროვე ხელოვნების გამორჩეული კოლექცია.", "2–3 სთ", "$$"),
        a("Broadway Show", "events", "Midtown", "საღამოს მიუზიკლი ან სპექტაკლი — ბილეთი წინასწარ შეამოწმე.", "2.5–3 სთ", "$$$"),
        a("Grand Central & Bryant Park", "landmarks", "Midtown", "ისტორიული სადგური, ბიბლიოთეკა და მცირე პარკი.", "1.5 სთ", "$"),
        a("Central Park South Route", "parks", "Upper Manhattan", "The Mall, Bethesda Terrace და Bow Bridge.", "2–3 სთ", "$"),
        a("The Metropolitan Museum of Art", "museums", "Upper East Side", "მსოფლიო ხელოვნების უზარმაზარი კოლექცია.", "3 სთ", "$$"),
        a("American Museum of Natural History", "family", "Upper West Side", "დინოზავრები, კოსმოსი და ოჯახური ექსპოზიციები.", "3 სთ", "$$"),
        a("Fifth Avenue & Rockefeller Center", "shopping", "Midtown", "მთავარი მაღაზიები და Rockefeller Plaza.", "2 სთ", "$$"),
        a("Chelsea Market & High Line", "food", "Chelsea", "ლანჩი ბაზარში და გასეირნება ქალაქის მაღალ პარკში.", "2–3 სთ", "$$"),
        a("Hudson Yards & The Vessel", "landmarks", "Chelsea", "თანამედროვე არქიტექტურა და Hudson River-ის ხედები.", "1.5 სთ", "$"),
        a("Greenwich Village Food Walk", "food", "Greenwich Village", "პიცა, ბეიგელი და კლასიკური ნიუ-იორკული დესერტი.", "2.5 სთ", "$$"),
        a("SoHo & Nolita", "shopping", "SoHo", "ბუტიკები, თუჯის არქიტექტურა და კაფეები.", "2–3 სთ", "$$"),
        a("Harlem & Apollo Theater", "music", "Harlem", "Harlem-ის ისტორია, Apollo Theater და soul food.", "2–3 სთ", "$$"),
        a("Live Jazz in Greenwich Village", "music", "Greenwich Village", "საღამოს ჯაზ-კლუბი; დაჯავშნა რეკომენდებულია.", "2–3 სთ", "$$"),
        a("Yankee Stadium Experience", "sports", "The Bronx", "თამაშის ბილეთი ან სტადიონის ტური სეზონის მიხედვით.", "3 სთ", "$$$"),
        a("Williamsburg Waterfront", "nightlife", "Williamsburg", "საღამოს ხედები, კაფეები და ადგილობრივი ბარები.", "2–3 სთ", "$$"),
        a("Prospect Park & Brooklyn Museum", "museums", "Central Brooklyn", "პარკი და ბრუკლინის მთავარი ხელოვნების მუზეუმი.", "3–4 სთ", "$$"),
        a("Roosevelt Island Tram", "family", "Roosevelt Island", "საბაგირო, Four Freedoms Park და skyline-ის ხედები.", "2 სთ", "$")
      ]
    },
    miami: {
      nameKa: "მაიამი",
      nameEn: "Miami",
      activities: [
        a("South Beach & Ocean Drive", "landmarks", "Miami Beach", "Art Deco არქიტექტურა და სანაპირო გასეირნება.", "2–3 სთ", "$"),
        a("Art Deco Historic District", "museums", "Miami Beach", "ფერადი ისტორიული შენობების საფეხმავლო ტური.", "1.5 სთ", "$"),
        a("Lincoln Road", "shopping", "Miami Beach", "ღია სავაჭრო ქუჩა, კაფეები და გალერეები.", "2 სთ", "$$"),
        a("Little Havana Food Walk", "food", "Little Havana", "Calle Ocho, კუბური ყავა და ტრადიციული კერძები.", "2.5 სთ", "$$"),
        a("Live Latin Music on Calle Ocho", "music", "Little Havana", "საღამოს ლათინო მუსიკა და ცეკვა.", "2–3 სთ", "$$"),
        a("Wynwood Walls", "museums", "Wynwood", "ქუჩის ხელოვნება და თანამედროვე გალერეები.", "2 სთ", "$$"),
        a("Wynwood Night Out", "nightlife", "Wynwood", "რესტორნები, მუსიკა და ბარები ერთ უბანში.", "3 სთ", "$$$"),
        a("Vizcaya Museum & Gardens", "museums", "Coconut Grove", "ისტორიული ვილა და ევროპული სტილის ბაღები.", "2.5 სთ", "$$"),
        a("Bayside Marketplace", "shopping", "Downtown Miami", "წყლისპირა მაღაზიები და ლაივ მუსიკა.", "2 სთ", "$$"),
        a("Biscayne Bay Boat Tour", "family", "Downtown Miami", "ქალაქისა და ვარსკვლავების სახლების ხედები წყლიდან.", "1.5 სთ", "$$"),
        a("Pérez Art Museum Miami", "museums", "Downtown Miami", "თანამედროვე ხელოვნება და Bayfront-ის ხედები.", "2 სთ", "$$"),
        a("Kaseya Center Game or Concert", "events", "Downtown Miami", "NBA თამაში ან კონცერტი კალენდრის მიხედვით.", "3 სთ", "$$$"),
        a("Key Biscayne & Crandon Park", "parks", "Key Biscayne", "მშვიდი სანაპირო და პარკი ქალაქის ხმაურისგან მოშორებით.", "3–4 სთ", "$"),
        a("Everglades Airboat Tour", "family", "Everglades", "საჰაერო ნავით ტური და ველური ბუნება.", "4–5 სთ", "$$$"),
        a("Design District", "shopping", "Miami Design District", "დიზაინი, არქიტექტურა და პრემიუმ მაღაზიები.", "2 სთ", "$$$"),
        a("LoanDepot Park Baseball", "sports", "Little Havana", "Miami Marlins-ის თამაში სეზონის მიხედვით.", "3 სთ", "$$$")
      ]
    },
    "los-angeles": {
      nameKa: "ლოს-ანჯელესი",
      nameEn: "Los Angeles",
      activities: [
        a("Hollywood Walk of Fame", "landmarks", "Hollywood", "Hollywood Boulevard-ის მთავარი სიმბოლოები.", "1.5 სთ", "$"),
        a("Griffith Observatory", "landmarks", "Los Feliz", "ქალაქისა და Hollywood Sign-ის პანორამული ხედი.", "2–3 სთ", "$"),
        a("Hollywood Sign Hike", "parks", "Griffith Park", "საშუალო სირთულის მარშრუტი საუკეთესო ხედებისთვის.", "2.5 სთ", "$"),
        a("Academy Museum of Motion Pictures", "museums", "Museum Row", "კინოს ისტორია და ინტერაქტიული გამოფენები.", "2.5 სთ", "$$"),
        a("The Getty Center", "museums", "Brentwood", "ხელოვნება, ბაღები და უფასო ქალაქის ხედები.", "3 სთ", "$"),
        a("LACMA & Urban Light", "museums", "Museum Row", "ხელოვნება და ცნობილი Urban Light ინსტალაცია.", "2.5 სთ", "$$"),
        a("Santa Monica Pier", "family", "Santa Monica", "ოკეანე, ატრაქციონები და მზის ჩასვლა.", "2–3 სთ", "$$"),
        a("Venice Beach & Canals", "landmarks", "Venice", "Boardwalk, არხები და ადგილობრივი ქუჩის კულტურა.", "2.5 სთ", "$"),
        a("Rodeo Drive & Beverly Hills", "shopping", "Beverly Hills", "ლუქს-მაღაზიები და ცნობილი ქუჩები.", "2 სთ", "$$$"),
        a("The Grove & Original Farmers Market", "food", "Fairfax", "ადგილობრივი საკვები და საღამოს შოპინგი.", "2.5 სთ", "$$"),
        a("Downtown LA Food Market", "food", "Downtown LA", "Grand Central Market და ისტორიული ცენტრი.", "2 სთ", "$$"),
        a("The Broad", "museums", "Downtown LA", "თანამედროვე ხელოვნება; უფასო დროის დაჯავშნა სასურველია.", "2 სთ", "$"),
        a("Universal Studios Hollywood", "family", "Universal City", "სრული დღე ატრაქციონებითა და კინოს სამყაროთი.", "7–9 სთ", "$$$"),
        a("Dodger Stadium Game", "sports", "Elysian Park", "ბეისბოლის თამაში სეზონის მიხედვით.", "3–4 სთ", "$$$"),
        a("Sunset Strip Live Music", "music", "West Hollywood", "ცოცხალი მუსიკა ისტორიულ კლუბებში.", "3 სთ", "$$$"),
        a("West Hollywood Night Out", "nightlife", "West Hollywood", "რესტორნები, rooftop-ბარები და საღამოს ცხოვრება.", "3 სთ", "$$$")
      ]
    },
    chicago: {
      nameKa: "ჩიკაგო",
      nameEn: "Chicago",
      activities: [
        a("Millennium Park & The Bean", "landmarks", "The Loop", "Cloud Gate და ქალაქის ცენტრალური პარკი.", "1.5 სთ", "$"),
        a("Art Institute of Chicago", "museums", "The Loop", "აშშ-ის ერთ-ერთი საუკეთესო ხელოვნების კოლექცია.", "3 სთ", "$$"),
        a("Chicago Architecture River Cruise", "landmarks", "Chicago River", "ქალაქის არქიტექტურის საუკეთესო გაცნობა წყლიდან.", "1.5 სთ", "$$"),
        a("Chicago Riverwalk", "parks", "The Loop", "გასეირნება მდინარის გასწვრივ კაფეებითა და ხედებით.", "1.5 სთ", "$"),
        a("Skydeck Chicago", "landmarks", "The Loop", "Willis Tower-ის მინის აივანი და პანორამა.", "1.5 სთ", "$$"),
        a("Navy Pier", "family", "Streeterville", "ტბის ხედები, ატრაქციონები და საღამოს პროგრამა.", "2–3 სთ", "$$"),
        a("Museum of Science and Industry", "family", "Hyde Park", "დიდი ინტერაქტიული სამეცნიერო მუზეუმი.", "3–4 სთ", "$$"),
        a("Field Museum", "museums", "Museum Campus", "ბუნების ისტორია და ცნობილი T. rex SUE.", "3 სთ", "$$"),
        a("Lakefront Trail", "parks", "Lake Michigan", "ტბისპირა გასეირნება ან ველოსიპედი.", "2 სთ", "$"),
        a("Deep-Dish Pizza Tasting", "food", "River North", "ჩიკაგოს კლასიკური deep-dish პიცა.", "1.5 სთ", "$$"),
        a("West Loop Food Hall", "food", "West Loop", "თანამედროვე რესტორნები და Time Out Market-ის ტიპის არჩევანი.", "2 სთ", "$$"),
        a("Magnificent Mile", "shopping", "Michigan Avenue", "ცენტრალური სავაჭრო ქუჩა და ისტორიული შენობები.", "2 სთ", "$$"),
        a("Chicago Blues Club", "music", "River North", "ცოცხალი ბლუზი ქალაქის კლასიკურ კლუბში.", "2.5 სთ", "$$"),
        a("Wrigley Field Game", "sports", "Wrigleyville", "Chicago Cubs-ის თამაში სეზონის მიხედვით.", "3–4 სთ", "$$$"),
        a("United Center Game or Concert", "events", "Near West Side", "NBA, NHL ან კონცერტი მიმდინარე კალენდრით.", "3 სთ", "$$$"),
        a("River North Nightlife", "nightlife", "River North", "საღამოს ბარები და rooftop ხედები.", "3 სთ", "$$$")
      ]
    },
    "san-francisco": {
      nameKa: "სან-ფრანცისკო",
      nameEn: "San Francisco",
      activities: [
        a("Golden Gate Bridge", "landmarks", "Presidio", "ხიდზე გასეირნება და Battery Spencer-ის ხედები.", "2 სთ", "$"),
        a("Alcatraz Island", "museums", "San Francisco Bay", "ისტორიული ციხის აუდიოტური; დაჯავშნე წინასწარ.", "3 სთ", "$$"),
        a("Fisherman’s Wharf & Pier 39", "family", "Waterfront", "ზღვის ლომები, სანაპირო და საოჯახო ატმოსფერო.", "2–3 სთ", "$$"),
        a("Cable Car Ride", "landmarks", "Downtown", "ქალაქის კლასიკური ტრანსპორტი და გორაკები.", "1 სთ", "$"),
        a("Chinatown Food Walk", "food", "Chinatown", "დიმ-სამი, საცხობები და ისტორიული ქუჩები.", "2 სთ", "$$"),
        a("North Beach & Coit Tower", "landmarks", "North Beach", "იტალიური უბანი და ქალაქის პანორამა.", "2.5 სთ", "$$"),
        a("Golden Gate Park", "parks", "Golden Gate Park", "ბაღები, ტბები და მშვიდი შუადღე.", "3 სთ", "$"),
        a("California Academy of Sciences", "family", "Golden Gate Park", "აკვარიუმი, პლანეტარიუმი და ბუნების მუზეუმი.", "3–4 სთ", "$$$"),
        a("de Young Museum", "museums", "Golden Gate Park", "ხელოვნება და უფასო სადამკვირვებლო კოშკი.", "2.5 სთ", "$$"),
        a("Mission District Murals", "museums", "Mission District", "Balmy Alley-ის ქუჩის ხელოვნება.", "1.5 სთ", "$"),
        a("Mission Burrito Stop", "food", "Mission District", "ადგილობრივი სტილის დიდი burrito.", "1 სთ", "$"),
        a("Union Square", "shopping", "Downtown", "მაღაზიები და ქალაქის ცენტრის ენერგია.", "2 სთ", "$$"),
        a("Oracle Park Game", "sports", "SoMa", "San Francisco Giants-ის თამაში და Bay-ის ხედები.", "3–4 სთ", "$$$"),
        a("Live Music at The Fillmore", "music", "Fillmore", "კონცერტი ისტორიულ დარბაზში კალენდრის მიხედვით.", "3 სთ", "$$$"),
        a("Castro & Twin Peaks", "landmarks", "Castro", "უბნის ისტორია და საღამოს პანორამული ხედი.", "2.5 სთ", "$"),
        a("SoMa Night Out", "nightlife", "SoMa", "რესტორნები, მუსიკა და ღამის კლუბები.", "3 სთ", "$$$")
      ]
    },
    "las-vegas": {
      nameKa: "ლას-ვეგასი",
      nameEn: "Las Vegas",
      activities: [
        a("Las Vegas Strip Walk", "landmarks", "The Strip", "სასტუმროების, შადრევნებისა და ნეონის მთავარი მარშრუტი.", "2–3 სთ", "$"),
        a("Bellagio Fountains & Conservatory", "landmarks", "The Strip", "უფასო შოუ და სეზონური ბოტანიკური ინსტალაცია.", "1.5 სთ", "$"),
        a("High Roller Observation Wheel", "family", "The Strip", "ქალაქის პანორამული ხედი 167 მეტრიდან.", "1 სთ", "$$"),
        a("The Sphere Experience", "events", "The Strip", "იმერსიული შოუ ან კონცერტი პროგრამის მიხედვით.", "2 სთ", "$$$"),
        a("Neon Museum", "museums", "Downtown", "ძველი Las Vegas-ის ნეონის ნიშნები.", "1.5 სთ", "$$"),
        a("Mob Museum", "museums", "Downtown", "ორგანიზებული დანაშაულისა და სამართალდაცვის ისტორია.", "2.5 სთ", "$$"),
        a("Fremont Street Experience", "nightlife", "Downtown", "LED შოუ, მუსიკა და ძველი Vegas-ის ატმოსფერო.", "2–3 სთ", "$$"),
        a("Downtown Food Tour", "food", "Downtown", "ადგილობრივი რესტორნები და მრავალფეროვანი დეგუსტაცია.", "2.5 სთ", "$$$"),
        a("Premium Outlets North", "shopping", "Downtown", "ბრენდული outlet მაღაზიები.", "3 სთ", "$$"),
        a("Cirque du Soleil Show", "events", "The Strip", "Vegas-ის კლასიკური მაღალი დონის შოუ.", "2 სთ", "$$$"),
        a("T-Mobile Arena Event", "sports", "The Strip", "NHL თამაში, UFC ან კონცერტი კალენდრის მიხედვით.", "3 სთ", "$$$"),
        a("Topgolf Las Vegas", "sports", "The Strip", "გოლფის გასართობი სივრცე ქალაქის ხედებით.", "2 სთ", "$$$"),
        a("Red Rock Canyon", "parks", "Red Rock Canyon", "სცენური გზა და მოკლე საფეხმავლო მარშრუტები.", "4 სთ", "$$"),
        a("Hoover Dam Day Trip", "landmarks", "Boulder City", "დამბა, ვიზიტორთა ცენტრი და უდაბნოს ხედები.", "4–5 სთ", "$$"),
        a("AREA15", "family", "Off-Strip", "ინტერაქტიული ხელოვნება და Meow Wolf Omega Mart.", "3 სთ", "$$$"),
        a("Rooftop Lounge Evening", "nightlife", "The Strip", "საღამოს ხედები და მუსიკა rooftop-ლაუნჯში.", "2–3 სთ", "$$$")
      ]
    },
    "washington-dc": {
      nameKa: "ვაშინგტონი",
      nameEn: "Washington, D.C.",
      activities: [
        a("National Mall Monuments", "landmarks", "National Mall", "Lincoln Memorial, Reflecting Pool და Washington Monument.", "3 სთ", "$"),
        a("U.S. Capitol Grounds", "landmarks", "Capitol Hill", "კაპიტოლიუმის ტერიტორია და წინასწარ დაჯავშნილი ტური.", "2 სთ", "$"),
        a("Smithsonian Air and Space Museum", "museums", "National Mall", "ავიაცია და კოსმოსის ისტორია.", "2.5 სთ", "$"),
        a("National Museum of American History", "museums", "National Mall", "ამერიკის კულტურისა და ისტორიის მთავარი ექსპონატები.", "2.5 სთ", "$"),
        a("National Gallery of Art", "museums", "National Mall", "მსოფლიო ხელოვნება უფასო შესვლით.", "2.5 სთ", "$"),
        a("Museum of Natural History", "family", "National Mall", "დინოზავრები, ძვირფასი ქვები და ოჯახური ექსპოზიციები.", "2.5 სთ", "$"),
        a("White House & Lafayette Square", "landmarks", "Downtown", "თეთრი სახლის გარე ხედები და ისტორიული მოედანი.", "1 სთ", "$"),
        a("Georgetown Waterfront", "parks", "Georgetown", "წყლისპირა გასეირნება და ისტორიული ქუჩები.", "2 სთ", "$"),
        a("Georgetown Dining", "food", "Georgetown", "ადგილობრივი რესტორნები და ცნობილი cupcake-ები.", "1.5 სთ", "$$"),
        a("Eastern Market", "food", "Capitol Hill", "ადგილობრივი საკვები, ხელნაკეთი ნივთები და ბაზარი.", "2 სთ", "$$"),
        a("The Wharf", "music", "Southwest Waterfront", "რესტორნები, waterfront და ცოცხალი მუსიკა.", "2–3 სთ", "$$"),
        a("Kennedy Center Performance", "events", "Foggy Bottom", "კონცერტი, თეატრი ან უფასო Millennium Stage.", "2.5 სთ", "$$"),
        a("Rock Creek Park", "parks", "Northwest D.C.", "ბუნება და მშვიდი საფეხმავლო მარშრუტები.", "2–3 სთ", "$"),
        a("CityCenterDC", "shopping", "Downtown", "ბუტიკები, კაფეები და თანამედროვე ქალაქის სივრცე.", "2 სთ", "$$$"),
        a("Nationals Park Game", "sports", "Navy Yard", "MLB თამაში სეზონის მიხედვით.", "3–4 სთ", "$$$"),
        a("U Street Nightlife", "nightlife", "U Street", "ჯაზი, მუსიკა და ისტორიული ღამის ცხოვრება.", "3 სთ", "$$")
      ]
    },
    boston: {
      nameKa: "ბოსტონი",
      nameEn: "Boston",
      activities: [
        a("Freedom Trail", "landmarks", "Downtown", "ისტორიული 4-კილომეტრიანი მარშრუტი ქალაქის ცენტრში.", "3 სთ", "$"),
        a("Boston Common & Public Garden", "parks", "Back Bay", "ქალაქის ისტორიული პარკები და Swan Boats.", "1.5 სთ", "$"),
        a("Museum of Fine Arts", "museums", "Fenway", "მსოფლიო ხელოვნების დიდი კოლექცია.", "3 სთ", "$$"),
        a("Isabella Stewart Gardner Museum", "museums", "Fenway", "უნიკალური სასახლე, ბაღი და ხელოვნება.", "2 სთ", "$$"),
        a("Fenway Park Tour or Game", "sports", "Fenway", "Red Sox-ის თამაში ან ისტორიული სტადიონის ტური.", "3 სთ", "$$$"),
        a("Quincy Market", "food", "Downtown", "New England-ის კერძები და სწრაფი ლანჩის დიდი არჩევანი.", "1.5 სთ", "$$"),
        a("North End Food Walk", "food", "North End", "იტალიური სამზარეულო, cannoli და ისტორიული ქუჩები.", "2.5 სთ", "$$"),
        a("New England Aquarium", "family", "Waterfront", "დიდი ოკეანის ავზი და ოჯახური ექსპოზიციები.", "2.5 სთ", "$$"),
        a("Boston Harbor Cruise", "family", "Waterfront", "ქალაქის skyline-ის ხედები წყლიდან.", "2 სთ", "$$"),
        a("Harvard Yard & Harvard Square", "landmarks", "Cambridge", "უნივერსიტეტის კამპუსი, წიგნის მაღაზიები და კაფეები.", "2 სთ", "$"),
        a("MIT & Kendall Square", "museums", "Cambridge", "თანამედროვე არქიტექტურა და ტექნოლოგიური უბანი.", "1.5 სთ", "$"),
        a("Newbury Street", "shopping", "Back Bay", "ბუტიკები, გალერეები და კაფეები.", "2 სთ", "$$"),
        a("Live Music in Cambridge", "music", "Cambridge", "კლუბი ან კონცერტი მიმდინარე პროგრამის მიხედვით.", "2.5 სთ", "$$"),
        a("Seaport Evening", "nightlife", "Seaport", "წყლისპირა რესტორნები და საღამოს ქალაქის ხედები.", "3 სთ", "$$$")
      ]
    },
    orlando: {
      nameKa: "ორლანდო",
      nameEn: "Orlando",
      activities: [
        a("Walt Disney World Magic Kingdom", "family", "Lake Buena Vista", "სრული დღე კლასიკურ Disney პარკში.", "8–10 სთ", "$$$"),
        a("EPCOT", "family", "Lake Buena Vista", "მსოფლიო პავილიონები, ტექნოლოგია და საღამოს შოუ.", "8–10 სთ", "$$$"),
        a("Universal Studios Florida", "family", "Universal Orlando", "კინოატრაქციონები და Wizarding World.", "8–10 სთ", "$$$"),
        a("Islands of Adventure", "family", "Universal Orlando", "დიდი ატრაქციონები და თემატური ზონები.", "8–10 სთ", "$$$"),
        a("Disney Springs", "shopping", "Lake Buena Vista", "მაღაზიები, რესტორნები და უფასო საღამოს პროგრამა.", "3 სთ", "$$"),
        a("ICON Park", "family", "International Drive", "Observation wheel, აკვარიუმი და გასართობი სივრცეები.", "3–4 სთ", "$$"),
        a("Kennedy Space Center Day Trip", "museums", "Cape Canaveral", "NASA-ს ისტორია და რეალური კოსმოსური ტექნიკა.", "7–8 სთ", "$$$"),
        a("Lake Eola Park", "parks", "Downtown Orlando", "ტბისპირა გასეირნება და ქალაქის ცენტრი.", "1.5 სთ", "$"),
        a("Winter Park Scenic Boat Tour", "parks", "Winter Park", "ტბებისა და ისტორიული სახლების მშვიდი ტური.", "2 სთ", "$$"),
        a("Orlando Science Center", "museums", "Loch Haven Park", "ინტერაქტიული მეცნიერება ოჯახებისთვის.", "3 სთ", "$$"),
        a("The Mall at Millenia", "shopping", "Millenia", "დიდი სავაჭრო ცენტრი საერთაშორისო ბრენდებით.", "3 სთ", "$$"),
        a("International Drive Dining", "food", "International Drive", "რესტორნების დიდი არჩევანი და საღამოს გასეირნება.", "2.5 სთ", "$$"),
        a("NBA Game at Kia Center", "sports", "Downtown Orlando", "Orlando Magic-ის თამაში სეზონის მიხედვით.", "3 სთ", "$$$"),
        a("CityWalk Live Entertainment", "nightlife", "Universal Orlando", "მუსიკა, რესტორნები და საღამოს გართობა.", "3 სთ", "$$$")
      ]
    }
  };

  function a(name, category, zone, description, duration, cost) {
    return { name, category, zone, description, duration, cost };
  }

  const form = document.getElementById("plannerForm");
  const cityEl = document.getElementById("city");
  const startEl = document.getElementById("startDate");
  const endEl = document.getElementById("endDate");
  const paceEl = document.getElementById("pace");
  const budgetEl = document.getElementById("budget");
  const errorEl = document.getElementById("plannerError");
  const resultsEl = document.getElementById("plannerResults");
  const itineraryEl = document.getElementById("itinerary");
  let lastPlan = null;

  setDefaultDates();
  restoreForm();

  form.addEventListener("submit", event => {
    event.preventDefault();
    errorEl.classList.add("hidden");

    const dates = enumerateDates(startEl.value, endEl.value);
    const interests = [...document.querySelectorAll('input[name="interest"]:checked')].map(input => input.value);

    if (!startEl.value || !endEl.value) return showError("გთხოვ, მიუთითე დაწყებისა და დასრულების თარიღები.");
    if (dates.length === 0) return showError("დასრულების თარიღი დაწყების თარიღზე ადრე ვერ იქნება.");
    if (!interests.length) return showError("მონიშნე მინიმუმ ერთი სასურველი აქტივობა.");

    const guide = CITY_GUIDES[cityEl.value];
    const perDay = { relaxed: 2, balanced: 3, full: 4 }[paceEl.value] || 3;
    const plan = buildPlan(guide, dates, interests, perDay, budgetEl.value);
    lastPlan = plan;
    saveForm(interests);
    renderPlan(plan);
    track("trip_plan_generated", { city: guide.nameEn, days: dates.length, interests: interests.length });
  });

  document.getElementById("printPlan").addEventListener("click", () => window.print());
  document.getElementById("copyPlan").addEventListener("click", copyPlan);

  function buildPlan(guide, dates, interests, perDay, budget) {
    const budgetRank = { low: 1, mid: 2, high: 3 }[budget] || 2;
    let eligible = guide.activities.filter(item => interests.includes(item.category));
    if (eligible.length < perDay) eligible = [...guide.activities];

    const affordable = eligible.filter(item => costRank(item.cost) <= budgetRank);
    if (affordable.length >= perDay) eligible = affordable;

    const zones = [...new Set(eligible.map(item => item.zone))];
    const used = new Set();
    const days = dates.map((date, dayIndex) => {
      const zone = zones[dayIndex % zones.length];
      const local = eligible.filter(item => item.zone === zone && !used.has(item.name));
      const unused = eligible.filter(item => !used.has(item.name) && item.zone !== zone);
      let chosen = [...local, ...rotate(unused, dayIndex)].slice(0, perDay);

      if (chosen.length < perDay) {
        if (used.size >= eligible.length) used.clear();
        const refill = rotate(eligible.filter(item => !chosen.includes(item)), dayIndex + 1);
        chosen = [...chosen, ...refill].slice(0, perDay);
      }

      chosen.forEach(item => used.add(item.name));
      return { date, zone: dominantZone(chosen, zone), activities: chosen };
    });

    return { guide, dates, interests, perDay, budget, days };
  }

  function renderPlan(plan) {
    const first = formatDateKa(plan.dates[0]);
    const last = formatDateKa(plan.dates[plan.dates.length - 1]);
    document.getElementById("summaryTitle").textContent = `${plan.guide.nameKa} — ${plan.dates.length} დღე`;
    document.getElementById("summaryMeta").textContent =
      `${first} – ${last} • ${plan.perDay} აქტივობა ყოველდღე • ${plan.interests.length} არჩეული ინტერესი`;

    itineraryEl.innerHTML = plan.days.map((day, index) => renderDay(plan.guide, day, index, plan.perDay)).join("");
    resultsEl.classList.remove("hidden");
    resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderDay(guide, day, index, perDay) {
    const times = ({ 2: ["10:00", "16:00"], 3: ["09:30", "13:30", "18:00"], 4: ["09:00", "12:00", "15:30", "19:30"] })[perDay];
    const dateEn = formatDateEn(day.date);
    const query = `${guide.nameEn} live events ${dateEn}`;
    const eventLinks = [
      ["Google Events", `https://www.google.com/search?q=${encodeURIComponent(query)}`],
      ["Ticketmaster", `https://www.google.com/search?q=${encodeURIComponent(`site:ticketmaster.com ${query}`)}`],
      ["Eventbrite", `https://www.google.com/search?q=${encodeURIComponent(`site:eventbrite.com ${query}`)}`]
    ];

    return `
      <article class="day-card">
        <header class="day-head">
          <div>
            <span class="day-number">დღე ${index + 1}</span>
            <h3>${escapeHtml(formatDateKa(day.date, true))}</h3>
          </div>
          <span class="day-zone">📍 ${escapeHtml(day.zone)}</span>
        </header>
        <div class="day-content">
          ${day.activities.map((item, activityIndex) => `
            <div class="activity-row">
              <span class="activity-time">${times[activityIndex] || ""}</span>
              <div class="activity-copy">
                <h4>${escapeHtml(item.name)}</h4>
                <p>${escapeHtml(item.description)}</p>
                <div class="activity-meta">
                  <span>${escapeHtml(CATEGORIES[item.category] || item.category)}</span>
                  <span>⏱ ${escapeHtml(item.duration)}</span>
                  <span>${escapeHtml(item.cost)}</span>
                  <span>📍 ${escapeHtml(item.zone)}</span>
                </div>
              </div>
              <a class="activity-map" href="${mapsUrl(guide.nameEn, item.name)}" target="_blank" rel="noopener">რუკაზე ნახვა ↗</a>
            </div>
          `).join("")}
          <div class="event-search">
            <b>🎟️ Live Events — English search</b>
            <p>${escapeHtml(query)}</p>
            <div class="event-links">
              ${eventLinks.map(([label, href]) => `<a href="${href}" target="_blank" rel="noopener">${label} ↗</a>`).join("")}
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function enumerateDates(startValue, endValue) {
    if (!startValue || !endValue) return [];
    const start = new Date(`${startValue}T00:00:00Z`);
    const end = new Date(`${endValue}T00:00:00Z`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return [];
    const dates = [];
    for (let current = new Date(start); current <= end; current.setUTCDate(current.getUTCDate() + 1)) {
      dates.push(new Date(current));
    }
    return dates;
  }

  function formatDateKa(date, weekday = false) {
    return new Intl.DateTimeFormat("ka-GE", {
      timeZone: "UTC",
      day: "numeric",
      month: "long",
      year: "numeric",
      ...(weekday ? { weekday: "long" } : {})
    }).format(date);
  }

  function formatDateEn(date) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(date);
  }

  function setDefaultDates() {
    if (startEl.value || endEl.value) return;
    const start = new Date();
    start.setDate(start.getDate() + 14);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    startEl.value = toInputDate(start);
    endEl.value = toInputDate(end);
    startEl.min = toInputDate(new Date());
    endEl.min = startEl.value;
  }

  startEl.addEventListener("change", () => {
    endEl.min = startEl.value;
    if (endEl.value && endEl.value < startEl.value) endEl.value = startEl.value;
  });

  function toInputDate(date) {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  function rotate(items, offset) {
    if (!items.length) return [];
    const cut = offset % items.length;
    return [...items.slice(cut), ...items.slice(0, cut)];
  }

  function dominantZone(items, fallback) {
    const count = items.reduce((acc, item) => {
      acc[item.zone] = (acc[item.zone] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || fallback;
  }

  function costRank(cost) {
    return cost === "$" ? 1 : cost === "$$" ? 2 : 3;
  }

  function mapsUrl(city, place) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place}, ${city}`)}`;
  }

  function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }

  async function copyPlan() {
    if (!lastPlan) return;
    const text = lastPlan.days.map((day, index) => {
      const activities = day.activities.map((item, i) => `${i + 1}. ${item.name} — ${item.zone}`).join("\n");
      return `დღე ${index + 1} — ${formatDateKa(day.date, true)}\n${activities}`;
    }).join("\n\n");
    try {
      await navigator.clipboard.writeText(`${lastPlan.guide.nameKa}\n\n${text}`);
      const button = document.getElementById("copyPlan");
      const original = button.textContent;
      button.textContent = "დაკოპირდა ✓";
      setTimeout(() => { button.textContent = original; }, 1800);
    } catch {
      showError("კოპირება ვერ მოხერხდა. გამოიყენე PDF / ამობეჭდვა.");
    }
  }

  function saveForm(interests) {
    try {
      localStorage.setItem("usaTripPlannerPreferences", JSON.stringify({
        city: cityEl.value,
        pace: paceEl.value,
        budget: budgetEl.value,
        interests
      }));
    } catch {}
  }

  function restoreForm() {
    try {
      const saved = JSON.parse(localStorage.getItem("usaTripPlannerPreferences") || "null");
      if (!saved) return;
      if (CITY_GUIDES[saved.city]) cityEl.value = saved.city;
      if (["relaxed", "balanced", "full"].includes(saved.pace)) paceEl.value = saved.pace;
      if (["low", "mid", "high"].includes(saved.budget)) budgetEl.value = saved.budget;
      if (Array.isArray(saved.interests)) {
        document.querySelectorAll('input[name="interest"]').forEach(input => {
          input.checked = saved.interests.includes(input.value);
        });
      }
    } catch {}
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
  }

  function track(name, params) {
    try {
      if (typeof window.gtag === "function") window.gtag("event", name, params);
    } catch {}
  }
})();
