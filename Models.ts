
//Clase Padre
type User = {
    //Datos comunes a cualquier rol
    id: number,
    name: string,
    email: string,
    password: string,
    role: UserIT | Company | Recruiter | OtherUser,
}
//Clases Hijas
    type UserIT = {
        type: Type,               

        languages?: Knowledge[],

        tecnologies?: Knowledge[],

        experience?: Experience[],

        proyectsPreferences? : [
            {
                type: string,
                languages?: string[],
            }
        ],
        meetingProyects?: Proyect[],
    }

    type Company = {
        nameCompany: string,
        cuit: string,
        description?: string,
        address?: string,
        phone?: string,
        website?: string,
    }

    type Recruiter = {
        recruiterExperience?: Experience[],
    }

    type OtherUser = {
        isPyme: boolean,
        isStartup: boolean,
    }

/* ******************************************************************************************* */
//Types Comunes
type Experience =  {
    company: string,
    position: string,
    description?: string,
    start?: Date,
    end?: Date,
}

type Knowledge = {
    name: string,
    type: Type,                  //Nos va a permitir filtrar los conocimientos por el type de Desarrollador       
    experience?: number,
}

enum State {
    Open = "Open",
    Close = "Close",
    InProgress = "InProgress",
}

enum Type {
    Web = "Web",
    Mobile = "Mobile",
    Desktop = "Desktop",
    VideoGames = "VideoGames",
    BlockChain = "BlockChain",
    AI = "AI",
    IoT = "IoT",
    PM = "PM",
    TL = "TL",
    Other = "Other",
}

enum weblanguages {
    HTML = "HTML",
    CSS = "CSS",
    JavaScript = "JavaScript",
    TypeScript = "TypeScript",
    PHP = "PHP",
    Python = "Python",
    Ruby = "Ruby",
    Java = "Java",
    C = "C#",
}

enum mobilelanguages {
    Java = "Java",
    Kotlin = "Kotlin",
    Swift = "Swift",
    ObjectiveC = "ObjectiveC",
    C = "C#",
}

enum desktoplanguages {
    Java = "Java",
    Kotlin = "Kotlin",
    Swift = "Swift",
    ObjectiveC = "ObjectiveC",
    C = "C#",
    Electron = "Electron",
}


/* ******************************************************************************************* */

type Proyect = {
    id: number,
    name: string,
    description: string,
    author: User,
    state: State,                                          
    logo?: string,
    type: Type,                         
    profiles: string[],
    languages?: Knowledge[],
    tecnologies?: Knowledge[],
    members?: UserIT[],             
}
