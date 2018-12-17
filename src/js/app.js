import $ from 'jquery';
import {symbolic_substitutio, color_code} from './code-coloring';
import * as escodegen from 'escodegen';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let code_to_color = $('#codePlaceholder').val();
        let input_vector = get_input_from_string($('#inputVector').val());
        $('#code_with_color').html('');
        
        let symbolic_substitution_obj = symbolic_substitutio(code_to_color);
        let symbolic_substitution_string = escodegen.generate(symbolic_substitution_obj);

        let color_output = color_code(symbolic_substitution_string, input_vector);
        let color_table = color_output[1];

        let colored_code = jsFriendlyJSONStringify(symbolic_substitution_string);
        colored_code = colored_code.substring(1, colored_code.length-1);
        show_colores_code(colored_code, color_table);
    });
});

const get_input_from_string = (input_vector_str) => {
    let input_vector = [];
    let input_arr = input_vector_str.split(';');
    input_arr.forEach(element => {
        if(!element.includes('"') && !element.includes('\'')){
            if(element.includes('[')){
                element = element.substring(1, element.length-1);
                element = element.replace(/[,]/g, ';');
                element = get_input_from_string(element);
                
            }
            else if(isNumeric(element)){
                element = parseFloat(element);
            }
        }
        input_vector.push(element);
    });
    return input_vector;
};

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

const show_colores_code = (colored_code, color_table) => {
    let colored_lines = String(colored_code).split('\n');
    var div_element = document.getElementById('code_with_color');
    let line_num = 1;
    colored_lines.forEach(element => {
        var para = document.createElement('pre');
        let cons = search_line(color_table, line_num++);
        if(typeof cons == 'boolean'){
            if(cons){
                para.setAttribute('id', 'green');
            }
            else{
                para.setAttribute('id', 'red');
            }
        }
        var node = document.createTextNode(element);
        para.appendChild(node);
        div_element.appendChild(para);
    });
};

function search_line(color_table, line_number){
    let cond = 'no_color';
    color_table.forEach(function(element){
        if(element.line == line_number && element.else !=='else'){
            cond = element.cond;
        }
    });
    return cond;
}

function jsFriendlyJSONStringify (s) {
    return JSON.stringify(s).replace(/\\r/g, '\r').replace(/\\n/g, '\n');
}