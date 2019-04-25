export class Upload {
    _id:string;
    subject:string;
    description:string;
    
    upload_date:Date;
    upload_by:string;
    files_id:string;
    
    filename: String;
    file_size: Number;

    delete_date?:Date;
    delete_by?:string;
    last_modified?:Date;
    parser_error?:string;

}