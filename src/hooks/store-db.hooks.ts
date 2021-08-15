import { useEffect, useState } from "react";
import { initJsStore, TAvailableDatabases } from "../db/database";


export const useStartDb = (database: TAvailableDatabases) => {
    const [isNew, setIsNew] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [isIndexedDbSupported, setIsIndexedDbSupported] = useState<boolean>(true);
    useEffect(() => {
        const startStore = async () => {
          try {
            const isDbCreated = await initJsStore(database);
            if (isDbCreated) {
                setIsNew(true)
              console.log("db created");
              // prefill database
            } else {
                setIsNew(false)
              console.log("db opened");
            }

            setIsIndexedDbSupported(true);
            setIsInitialized(true)
          } catch (ex) {
            console.error(ex);
            setIsIndexedDbSupported(false)
          }
        }

        startStore()
      }, [database]);

    return {isNew, isIndexedDbSupported, isInitialized}
} 