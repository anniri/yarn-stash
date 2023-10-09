import React, {createContext, useState, useEffect} from 'react';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Camera, PermissionResponse } from 'expo-camera';

interface Props {
    children: React.ReactNode
}

export interface Yarn {
    id: number
    name: string
    brand: string
    fibre: string
    weight: string
    grams: number
    picUrl: string
}

export interface Pattern {
    id: number
    name: string
    source: string
    sourceType: string
    yarnWeight: string
    yarnDemand: number
    picUrl: string
}

//Open (or create) database yarnstash
const db : SQLite.SQLiteDatabase = SQLite.openDatabase("yarnstash");

//Database has two tables: yarns and patterns 
db.transaction(
    (tx: SQLite.SQLTransaction) => {
        //Remove comments to clear database when testing
        //tx.executeSql("DROP TABLE yarns"); 
        //tx.executeSql("DROP TABLE patterns")

        tx.executeSql(`CREATE TABLE IF NOT EXISTS yarns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            brand TEXT,
            fibre TEXT,
            weight TEXT,
            grams INTEGER,
            picUrl TEXT
        )`);

        //Remove comment to add content to yarn table for testing
        /*tx.executeSql(`INSERT INTO yarns (name, brand, fibre, weight, grams, picUrl) VALUES
                     ("7 veljestä punainen", "Novita", "villa/polyamidi", "aran", 100, "https://www.novitaknits.com/media/catalog/product/cache/28d051cf897726a42ac7a6dad2308e0d/1/6/1683846444-632d37635c6927c83f0f8492_1.jpg"),
                     ("Tynn Line", "Sandnes Garn", "puuvilla/viskoosi/pellava", "fingering", 200, "")`)-'*/

        tx.executeSql(`CREATE TABLE IF NOT EXISTS patterns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            source TEXT,
            sourceType TEXT,
            yarnWeight TEXT,
            yarnDemand INTEGER,
            picUrl TEXT
        )`);
        
        //Remove comment to add content to pattern table for testing
        /*tx.executeSql(`INSERT INTO patterns (name, source, sourceType, yarnWeight, yarnDemand, picUrl) VALUES
                        ("Hanna-villasukat", "https://www.novitaknits.com/fi/novita-7-veljesta-hanna", "web", "aran", "150", "https://www.novitaknits.com/media/catalog/product/cache/28d051cf897726a42ac7a6dad2308e0d/n/o/novita_sukkalehti_2020_hanna2.jpg")`)*/
    },
    (err: SQLite.SQLError) => {
        console.log(err)
    }
)

export const AppContext : React.Context<any> = createContext(undefined);

export const AppProvider : React.FC<Props> = (props: Props) : React.ReactElement => {
    const [yarns, setYarns] = useState<Yarn[]>([]);
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const [addYarnView, setAddYarnView] = useState<boolean>(false);
    const [addPatternView, setAddPatternView] = useState<boolean>(false);
    const [cameraPermission, setCameraPermission] = useState<boolean>(false);

    const yarnWeights : string[] = ["lace", "light fingering", "fingering", 
                                    "sport", "dk", "worsted", "aran", "bulky", 
                                    "super bulky", "jumbo"];

    const patternTypes : string[] = ["web", "book", "magazine", "pdf"];

    const getPatterns = () : void => {
        db.transaction(
            (tx: SQLite.SQLTransaction) => {
                tx.executeSql("SELECT * FROM patterns", [],
                (_tx: SQLite.SQLTransaction, rs: SQLite.SQLResultSet) => {
                    setPatterns(rs.rows._array)
                });
            },
            (err: SQLite.SQLError) => {
                console.log(err)
            }
        )
    }

    const getYarns = () : void => {
        db.transaction(
            (tx: SQLite.SQLTransaction) => {
                tx.executeSql("SELECT * FROM yarns", [],
                (_tx: SQLite.SQLTransaction, rs: SQLite.SQLResultSet) => {
                    setYarns(rs.rows._array)
                });
            },
            (err: SQLite.SQLError) => {
                console.log(err)
            }
        )  
    }

    const addYarnToDB = (yarn : Yarn) : void => {
        db.transaction(
            (tx: SQLite.SQLTransaction) => {
                tx.executeSql(`INSERT INTO yarns (name, brand, fibre, weight, grams, picUrl) VALUES (?,?,?,?,?,?)`,
                            [yarn.name, yarn.brand, yarn.fibre, yarn.weight, yarn.grams, yarn.picUrl],
                            (_tx: SQLite.SQLTransaction, rs: SQLite.SQLResultSet) => {
                                getYarns();
                            })
            },
            (err: SQLite.SQLError) => {
                console.log(err)
            }
        )
    }

    const addPatternToDB = (pattern : Pattern) : void => {
        db.transaction(
            (tx: SQLite.SQLTransaction) => {
                tx.executeSql(`INSERT INTO patterns (name, source, sourceType, yarnWeight, yarnDemand, picUrl) VALUES (?,?,?,?,?,?)`,
                              [pattern.name, pattern.source, pattern.sourceType, pattern.yarnWeight, pattern.yarnDemand, pattern.picUrl],
                              (_tx : SQLite.SQLTransaction, rs: SQLite.SQLResultSet) => {
                                getPatterns();
                              })
            },
            (err: SQLite.SQLError) => {
                console.log(err)
            }
        )
    }

    const findMatchingPatterns = (yarnWeight : string) : Pattern[] => {
        return patterns.filter((pattern) => pattern.yarnWeight === yarnWeight);
    }

    const findMatchingYarns = (yarnWeight : string) : Yarn[] => {
        return yarns.filter((yarn : Yarn) => yarn.weight === yarnWeight);
    }

    const saveImage = async (srcType: string, srcUri: string, dir: string, name: string ) : Promise<string> => {
        const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + dir);

        if(!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + dir, {intermediates: true});
        }
        
        let newImgUrl = `${FileSystem.documentDirectory}${dir}/${name}.jpg`;
        
        if(srcType === "web") {
            await FileSystem.downloadAsync(srcUri, newImgUrl);
        } else if(srcType === "local") {
            await FileSystem.copyAsync({from: srcUri, to: newImgUrl});
        }
        return newImgUrl;
    }

    const handleCameraPermissions = async () : Promise<void> => {
        if(!cameraPermission) {
            let permissionRes : PermissionResponse = await Camera.requestCameraPermissionsAsync();
            setCameraPermission(permissionRes.granted);
        }
    }

    const checkCameraPermission = async () : Promise<void> => {
        let permission : PermissionResponse = await Camera.getCameraPermissionsAsync();
        setCameraPermission(permission.granted);
    }

    useEffect(() => {
        getYarns();
        getPatterns();
        checkCameraPermission();
    }, [])

    return (
        <AppContext.Provider value={{
                                    yarns, 
                                    patterns, 
                                    findMatchingPatterns,
                                    findMatchingYarns, 
                                    addYarnToDB,
                                    addPatternToDB,
                                    yarnWeights,
                                    addYarnView,
                                    setAddYarnView,
                                    addPatternView,
                                    setAddPatternView,
                                    patternTypes,
                                    saveImage,
                                    cameraPermission,
                                    handleCameraPermissions
                                    }}
        >
            {props.children}
        </AppContext.Provider>
    )
}