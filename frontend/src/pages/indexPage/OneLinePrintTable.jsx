import React, { useEffect, useState } from 'react';
import styles from './oneLinePrintTable.module.css';
import { VITE_BASE_URL } from '@/constants';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OneLinePrintTable = () => {
    const columnGroup = {
        col1: '20%',
        col2: '20%',
        col3: '10%',
        col4: '10%',
        col5: '20%',
        col6: '20%',
    };

    const [tableData, setTableData] = useState([])
    const [title, setTitle] = useState('')

    const { id } = useParams()

    const fetchData = async () => {
        try {
            const response = await axios.get(`${VITE_BASE_URL}/api/scripts/getOnelines/${id}`);
            const { data } = response;
            setTitle(response.data.oneLiners[0].title)
            setTableData(response.data.oneLiners[0].oneLiners);
        } catch (error) {
            console.error('Error while fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                <h3>{title && title}</h3>
            </div>
            <table className={styles.table}>
                <colgroup>
                    <col style={{ width: columnGroup.col1 }} />
                    <col style={{ width: columnGroup.col2 }} />
                    <col style={{ width: columnGroup.col3 }} />
                    <col style={{ width: columnGroup.col4 }} />
                    <col style={{ width: columnGroup.col5 }} />
                    <col style={{ width: columnGroup.col6 }} />
                </colgroup>
                <thead>
                    <tr>
                        <th className={styles.tableHead}>Scene</th>
                        <th className={styles.tableHead}>Location</th>
                        <th className={styles.tableHead}>Time</th>
                        <th className={styles.tableHead}>Int/Ext</th>
                        <th className={styles.tableHead}>Action</th>
                        <th className={styles.tableHead}>Charecter</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData &&
                        tableData.map((item, ind) => (
                            <tr key={ind}>
                                <td className={styles.tableData}>{item?.scene}</td>
                                <td className={styles.tableData}>{item?.location}</td>
                                <td className={styles.tableData}>{item?.time}</td>
                                <td className={styles.tableData}>{item?.IntOrExt}</td>
                                <td className={styles.tableData}>{item?.Action}</td>
                                <td className={styles.tableData}>{item?.Character}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default OneLinePrintTable;