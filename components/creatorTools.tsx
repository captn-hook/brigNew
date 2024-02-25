"use client";
import { Button } from '@nextui-org/button';

export const CreatorTools = () => {
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Creator Tools</h1>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('upload')}>Upload</Button>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('Save')}>Save</Button>
            </div>
        </div>
    );
}