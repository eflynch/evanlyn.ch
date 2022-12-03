import {memo, RefObject} from 'react';
import ContentEditable from './ContentEditable';
import ReactMarkdown from 'react-markdown'
import {convert} from 'html-to-text'

type NoteProps = {
    note:string;
    hasFocus:boolean;
    refInternal:RefObject<HTMLDivElement>;
    setNotes:(note:string)=>void;
};


function Note(props:NoteProps):JSX.Element {
    if (!props.hasFocus){
        return (
            <div className="magnolia_note">
                <ReactMarkdown>{convert(props.note)}</ReactMarkdown>
            </div>
        )
    }
    return (
        <div style={{wordWrap:'break-word', marginLeft:30, marginRight:30, marginTop:10, marginBottom:10}}>
            <ContentEditable html={props.note} refInternal={props.refInternal} className="" onChange={(e)=>{
                props.setNotes(e.target.value);
            }}/>
        </div>
    )
}

export default memo(Note);
