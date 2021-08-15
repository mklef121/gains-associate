import { useEffect, useState } from "react";
import { initJsStore } from "../db/database";
import { populateDatabase } from "../services/db-data.service";


export const useStartDb = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isNew, setIsNew] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [isIndexedDbSupported, setIsIndexedDbSupported] = useState<boolean>(true);
    useEffect(() => {
        const startStore = async () => {
          setIsLoading(true)
          try {
            const isDbCreated = await initJsStore("awsPicing");
            if (isDbCreated) {
                setIsNew(true)
              // prefill database
              await populateDatabase()
              
            } else {
                setIsNew(false)
            }

            setIsIndexedDbSupported(true);
            setIsInitialized(true)
          } catch (ex) {
            console.error(ex);
            setIsIndexedDbSupported(false)
          }

          setIsLoading(false)
        }

        startStore()
      }, []);

    return {isNew, isIndexedDbSupported, isInitialized, isLoading}
} 