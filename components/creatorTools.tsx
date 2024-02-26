"use client";
import { Button, ButtonGroup } from '@nextui-org/button';

export const CreatorTools = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <h1>Creator Tools</h1>
            <ButtonGroup>
                <Button radius="full" onPress={() => console.log('upload')}>Upload</Button>
                <Button radius="full" onPress={() => console.log('Save')}>Save</Button>
            </ButtonGroup>
        </div>
    );
}