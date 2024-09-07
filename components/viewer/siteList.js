
export const defaultDropd = 'Example';

export default function siteList(props) { //AHHH
    //empty dropdown
    while (props.leftPanel.dropd.options.length > 0) {
        props.leftPanel.dropd.remove(0);
    }
    //console.log(s);
    //add default option
    var def = document.createElement('option');
    def.text = defaultDropd
    props.leftPanel.dropd.add(def);

    props.sitelist.forEach((site) => {
        var option = document.createElement('option');
        option.text = site;
        props.leftPanel.dropd.add(option);

        if (props.window && props.window.location.hash != '' && props.window.location.hash[1] != '&') {
            if (props.window.location.hash.split('&')[0].substring(1) == props.leftPanel.dropd.options[props.leftPanel.dropd.length - 1].text) {
                props.leftPanel.dropd.selectedIndex = props.leftPanel.dropd.length - 1;
            }
        }
    })

}