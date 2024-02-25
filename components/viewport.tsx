'use client';
import { Button } from "@nextui-org/button";

export const Viewport = () => {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <canvas id="viewport" style={{ width: '100%', height: '100%' }}></canvas>
        </div>
    );
}
export const ViewportControl = () => {
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Viewport Controls</h1>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('camera mode')}>Camera</Button>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('values mode')}>Values</Button>
                <Button radius="full" style={{ margin : '5px' }} onPress={() => console.log('transparency mode')}>Transparency</Button>
            </div>
        </div>
    );
}