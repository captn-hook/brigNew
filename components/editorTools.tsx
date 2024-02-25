"use client";
import { Button } from '@nextui-org/button';

export const EditorTools = () => {
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Editor Tools</h1>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('place point')}>Place Point</Button>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('remove point')}>Remove Point</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('save')}>Save</Button>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('download')}>Download</Button>
            </div>
        </div>
    );
}
