export const OPACITY_INCREMENT = 0.035;
export const OPACITY_DECREMENT = 0.1;
// export const IRELAND_MAP_BASE_WIDTH = 728;
// export const IRELAND_MAP_BASE_HEIGHT = 906; old map
export const IRELAND_MAP_BASE_WIDTH = 1426;
export const IRELAND_MAP_BASE_HEIGHT = 1824;
// export const IRELAND_MAP_BASE_RATIO = 0.8035; old map
export const IRELAND_MAP_BASE_RATIO = 0.7818; // new map

export const COUNTY_NAMES = new Map([
    ['Munster', ['Cork','Kerry','Limerick','Waterford','Tipperary','Clare']],
    ['Ulster',  ['Donegal','Cavan','Monaghan','Antrim','Armagh',
                 'Derry','Down','Tyrone','Fermanagh']],
    ['Leinster',['Wexford','Kilkenny','Carlow','Wicklow','Dublin','Kildare',
                 'Meath','Laois','Offaly','Westmeath','Louth','Longford']],
    ['Connaught',['Galway','Mayo','Sligo','Leitrim','Roscommon']],
]);

export const COUNTY_INFO = new Map([
    ['antrim', {
        name : 'Antrim', 
        irishName : 'Aontroim', 
        gaaName : 'The Saffron County'}],
    ['armagh', {
        name : 'Armagh', 
        irishName :'Ard Mhacha', 
        gaaName : 'The Orchard County'}],
    ['carlow', {
        name : 'Carlow', 
        irishName : 'Ceatharlach', 
        gaaName : 'The Dolman County'}],
    ['cavan', {
        name : 'Cavan', 
        irishName : 'An Cabh\u00E1n', 
        gaaName : 'The Breffni County'}],
    ['clare', {
        name : 'Clare', 
        irishName : 'An Cl\u00E1r', 
        gaaName : 'The Banner County'}],
    ['cork', {
        name : 'Cork', 
        irishName : 'Corcaigh', 
        gaaName : 'The Rebel County'}],
    ['derry', {
        name : 'Derry', 
        irishName : 'Doire', 
        gaaName : 'The Oak Leaf County'}],
    ['donegal', {
        name : 'Donegal', 
        irishName : 'D\u00FAn na nGall', 
        gaaName : 'The T\u00EDr Conaill Men'}],
    ['down', {
        name : 'Down', 
        irishName :'An D\u00FAn', 
        gaaName : 'The Mourne County'}], 
    ['dublin', {
        name : 'Dublin', 
        irishName : '\u00C1th Cliath', 
        gaaName : 'The Metropolitans'}],
    ['fermanagh', {
        name : 'Fermanagh', 
        irishName : 'Fear Manach', 
        gaaName : ''}],
    ['galway', {
        name : 'Galway', 
        irishName : 'Gaillimh', 
        gaaName : 'The Tribesmen'}],
    ['kerry', {
        name : 'Kerry', 
        irishName : 'Ciarra\u00ED', 
        gaaName : 'The Kingdom'}],
    ['kildare', {
        name : 'Kildare', 
        irishName : 'Cill Dara', 
        gaaName : ''}],
    ['kilkenny', {
        name : 'Kilkenny', 
        irishName : 'Cill Chainnigh', 
        gaaName : 'The Marble County'}],
    ['laois', {
        name : 'Laois', 
        irishName : 'Laois', 
        gaaName : 'O\'Moore County'}],
    ['leitrim', {
        name : 'Leitrim', 
        irishName : 'Liatroim', 
        gaaName : 'The Wild Rose County'}],
    ['limerick', {
        name : 'Limerick', 
        irishName : 'Luimneach', 
        gaaName : 'The Treaty County'}],
    ['longford', {
        name : 'Longford',
        irishName : 'An Longfort', 
        gaaName : 'O\'Farrell County'}],
    ['louth', {
        name : 'Louth', 
        irishName : 'L\u00FA', 
        gaaName : 'The Wee County'}],
    ['mayo', {
        name : 'Mayo', 
        irishName : 'Maigh Eo', 
        gaaName : 'The Westerners'}],
    ['meath', {
        name : 'Meath', 
        irishName : 'An Mh\u00ED', 
        gaaName : 'The Royal County'}],
    ['monaghan', {
        name : 'Monaghan', 
        irishName : 'Muineach\u00E1n', 
        gaaName : 'Farney County'}],
    ['offaly', {
        name : 'Offaly',
        irishName : 'U\u00EDbh Fhail\u00ED',
        gaaName : 'The Faithful County'}],
    ['roscommon', {
        name : 'Roscommon',
        irishName : 'Ros Com\u00E1in',
        gaaName : 'The Sheepstealers'}],
    ['sligo', {
        name : 'Sligo', 
        irishName : 'Sligeach',
        gaaName : 'Yeat\'s County'}],
    ['tipperary', {
        name : 'Tipperary', 
        irishName : 'Tiobraid \u00C1rainn', 
        gaaName : 'The Premier County'}],
    ['tyrone', {
        name : 'Tyrone', 
        irishName : 'T\u00ED',
        gaaName : 'The Red Hand'}],
    ['waterford', {
        name : 'Waterford',
        irishName : 'Port L\u00E1irge',
        gaaName : 'The Deise'}],
    ['westmeath', {
        name : 'Westmeath',
        irishName : 'An Iarmh\u00ED',
        gaaName : 'The Lake County'}],
    ['wexford', {
        name : 'Wexford',
        irishName : 'Loch Garman',
        gaaName : 'The Model County'}],
    ['wicklow', {
        name : 'Wicklow',
        irishName : 'Cill Mhant\u00E1in',
        gaaName : 'The Garden County'}],
    ]);
    
