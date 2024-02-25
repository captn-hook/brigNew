"use client";
import React from "react";
import { Button } from "@nextui-org/button";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";

interface Item {
    id: number;
    name: string;
    email: string;
}

interface Column {
    uid: keyof Item;
    name: string;
}

export const SpreadSheet = () => {

    const headerColumns: Column[] = [
        { uid: "id", name: "ID" },
        { uid: "name", name: "Name" },
        { uid: "email", name: "Email" },
    ];

    const items: Item[] = [
        { id: 1, name: "John Doe", email: "fake@example.com" },
        { id: 2, name: "Jane Doe", email: "fake2@example.com" },
    ];


    return (
        <Table>
            <TableHeader>
                {headerColumns.map((column) => (
                    <TableColumn key={column.uid}>{column.name}</TableColumn>
                ))}
            </TableHeader>
            <TableBody>
                {items.map((item) => (
                    <TableRow key={item.id}>
                        {headerColumns.map((column) => (
                            <TableCell key={column.uid}>{item[column.uid]}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export const SpreadSheetControl = () => {
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Spreadsheet Controls</h1>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('toggle selection')}>Toggle Selection</Button>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('flip selection')}>Flip Selection</Button>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('clear selection')}>Clear Selection</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('toggle all')}>Toggle All</Button>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('flip all')}>Flip All</Button>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('flip selected')}>Flip Selected</Button>
            </div>
        </div>
    );
}

export const SpreadSheetEditor = () => {
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Spreadsheet Editor</h1>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('add row')}>Add Row</Button>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('remove row')}>Remove Row</Button>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('add column')}>Add Column</Button>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('remove column')}>Remove Column</Button>
            </div>
        </div>
    );
}