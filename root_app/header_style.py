#-*- coding: utf-8 -*-
from .header_meta import header_meta

def header_style():
    #return '123'

    retVal = ''
    imagePath = '/static/header.png'
    retVal += 'body{}'
    retVal += '#header{background:#000;}'
    retVal += '#header *{display: inline-block;}'
    x_accum = 0
    for i in header_meta['tabs']:
        tagname = i['id']
        shiftX = str(x_accum)
        if x_accum > 0:
            shiftX = '-%spx'%x_accum
        retVal += '#header .' + tagname + '{'\
            'background:url('+imagePath+') ' + shiftX + ' 0;'+\
            'width:%spx;height:%spx;'%(i['width'], header_meta['height'])+\
            '}'
        retVal += '#header .' + tagname + ':not(.active):hover{'\
            'background:url('+imagePath+') ' + shiftX + ' -%spx;'%header_meta['height']+\
            '}'
        retVal += '#header .' + tagname + '.active{'\
            'background:url('+imagePath+') ' + shiftX + ' -%spx;'%(2*header_meta['height'])+\
            '}'
        x_accum += i['width']
    return retVal
