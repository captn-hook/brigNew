"use client";
import { Button, ButtonGroup } from '@nextui-org/button';

export const EditorTools = () => {
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Editor Tools</h1>
            <ButtonGroup>
                <Button radius="full" onPress={() => console.log('place point')}>Place Point</Button>
                <Button radius="full" onPress={() => console.log('remove point')}>Remove Point</Button>
            </ButtonGroup>
            <br />
            <ButtonGroup style={{ marginTop: '10px' }}>
                <Button radius="full" onPress={() => console.log('save')}>Save</Button>
                <Button radius="full" onPress={() => console.log('download')}>Download</Button>
            </ButtonGroup>
        </div>
    );
}
