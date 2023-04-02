import React, { useEffect, useState, useContext } from "react";
import Button from 'react-bootstrap/Button';
import { myContext } from "../context/Context"
import * as XLSX from "xlsx";

const ExportXlsx = () => {
    const { getLocalStorage } = useContext(myContext)
    const [storage, setStorage] = useState([])

    const createWorkbook = (jsonData, sheetName = "Sheet1") => {
        const worksheet = XLSX.utils.json_to_sheet(jsonData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        return workbook;
    }

    const downloadXLSX = (workbook, filename = "export.xlsx") => {
        const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xff;
            }
            return buf;
        }

        const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    useEffect(() => {
        setStorage(storage => getLocalStorage()[0])
    }, [getLocalStorage])

    const statutDemandeConvert = (statut) => {
        if (statut === 1) {
            return "02 - EN COURS"
        }
        if (statut === 2 || statut === 3) {
            return "03 - TERMINE"
        }
    }

    const parseDateString = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return new Date(year, month - 1, day);
    }

    const calculDiffDate = (date1, date2) => {
        const differenceInMilliseconds = Math.abs(date2 - date1);
        return differenceInMilliseconds / (1000 * 60 * 60 * 24);
    }

    const handleExportXLSX = () => {
        const workbook = createWorkbook(buildObjFile(), "MySheet");
        downloadXLSX(workbook, "export.xlsx");
    };

    const buildObjFile = () => {
        let arrayDemand = []
        storage?.datas.forEach(data => {
            let obj = {}
            obj.dateDemande = data.dateDemand
            obj.demandeur = data.demandeur
            obj.natureDemande = "Audit"
            for (let item in data?.audit) {
                if (item === "etatActu") {
                    obj.demande = data?.audit[item]
                }
            }
            obj.gbook = data.gbook
            obj.auditeur = data.auditeur
            obj.debutDeTraitement = data.dateDebutAudit
            obj.finDeTraitement = data.dateFinAudit
            obj.dureeDePriseEnCharge = 0

            const date1String = data.dateDemand
            const date2String = data.dateFinAudit
            const date1 = parseDateString(date1String);
            const date2 = parseDateString(date2String);
            obj.dureeDeTraitementDePriseEnCharge = isNaN(calculDiffDate(date1, date2).toString()) ? 0 : calculDiffDate(date1, date2).toString()
            obj.statutDemande =  statutDemandeConvert(data.status)
            for (let item in data.audit) {
                if (item === "commentServ") {
                    obj.commentaire = data.audit[item]
                }
            }
            arrayDemand.push(obj)
        })
        return arrayDemand
    }



    return (
        <div><Button variant="outline-primary" onClick={handleExportXLSX} disabled={storage === undefined ? true : false}>EXPORTER</Button></div>
    )
}

export default ExportXlsx