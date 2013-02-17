/**
 * Copyright (C) 2011-2012 The XDocReport Team <xdocreport@googlegroups.com>
 *
 * All rights reserved.
 *
 * Permission is hereby granted, free  of charge, to any person obtaining
 * a  copy  of this  software  and  associated  documentation files  (the
 * "Software"), to  deal in  the Software without  restriction, including
 * without limitation  the rights to  use, copy, modify,  merge, publish,
 * distribute,  sublicense, and/or sell  copies of  the Software,  and to
 * permit persons to whom the Software  is furnished to do so, subject to
 * the following conditions:
 *
 * The  above  copyright  notice  and  this permission  notice  shall  be
 * included in all copies or substantial portions of the Software.
 *
 * THE  SOFTWARE IS  PROVIDED  "AS  IS", WITHOUT  WARRANTY  OF ANY  KIND,
 * EXPRESS OR  IMPLIED, INCLUDING  BUT NOT LIMITED  TO THE  WARRANTIES OF
 * MERCHANTABILITY,    FITNESS    FOR    A   PARTICULAR    PURPOSE    AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE,  ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
package fr.opensagres.xdocreport.remoting.converter.server;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.StreamingOutput;

import org.apache.commons.codec.binary.Base64;

import fr.opensagres.xdocreport.converter.ConverterRegistry;
import fr.opensagres.xdocreport.converter.ConverterTypeTo;
import fr.opensagres.xdocreport.converter.IConverter;
import fr.opensagres.xdocreport.converter.Options;
import fr.opensagres.xdocreport.converter.XDocConverterException;
import fr.opensagres.xdocreport.core.document.DocumentKind;
import fr.opensagres.xdocreport.core.io.IOUtils;
import fr.opensagres.xdocreport.core.logging.LogUtils;
import fr.opensagres.xdocreport.core.utils.Assert;
import fr.opensagres.xdocreport.core.utils.HttpHeaderUtils;
import fr.opensagres.xdocreport.remoting.domain.ConvertRequest;

/**
 * Document converter REST Web Service implementation.
 */
@Path( "/" )
public class ConverterServiceImpl
{

	private static final Logger LOGGER = LogUtils.getLogger(ConverterServiceImpl.class);
	@GET
    @Produces( MediaType.APPLICATION_JSON )
    @Path( "/list" )
    public ConvertRequest view(  )
    {
    	ConvertRequest request= new ConvertRequest();
    	request.download=false;
    	request.outputFormat=ConverterTypeTo.PDF.name();
    	request.via="XWPF";
    	
    	//request.document="hello".getBytes();
    	return request;
    }
	
	
    @POST
    @Consumes( MediaType.WILDCARD )
    @Produces( MediaType.WILDCARD )
    @Path( "/convert" )
    public Response convert( final ConvertRequest request )
    {
//    	System.out.println(request);
//    	System.err.println(request.document);
    	
    	final byte[] flux =Base64.decodeBase64(request.document.getBytes());
    /*	
    	try {
			FileOutputStream fout = new FileOutputStream("temp.ODT");
			fout.write(flux);
			fout.flush();
			fout.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
*/
    	

        try
        {
            Assert.notNull( request.document, "file is required" );
            Assert.notNull( request.outputFormat, "outputFormat is required" );
            Assert.notNull( request.via, "via is required" );
            // 1) Get the converter type to use
            ConverterTypeTo to = ConverterTypeTo.valueOf( request.outputFormat );
            if ( to == null )
            {
                throw new XDocConverterException( "Converter service cannot support the output format=" + request.outputFormat );
            }

            // 2) retrieve the document kind from the input mimeType
            String mimeType = request.mimeType;
            DocumentKind documentKind = DocumentKind.fromMimeType( mimeType );
            if ( documentKind == null )
            {
                throw new XDocConverterException( "Converter service cannot support mime-type=" + mimeType );
            }

            // 3) Get the converter from the registry
            final Options options = Options.getFrom( documentKind ).to( to ).via( request.via );
            final IConverter converter = ConverterRegistry.getRegistry().findConverter( options );

            // 4) Create an instance of JAX-RS StreamingOutput to convert the inputstream and set the result in the
            // response stream.
            StreamingOutput output = new StreamingOutput()
            {
                public void write( OutputStream out )
                    throws IOException, WebApplicationException
                {
                    try
                    {
                        long start = System.currentTimeMillis();
                        
                        converter.convert( new ByteArrayInputStream(flux), out, options );

                        if ( LOGGER.isLoggable( Level.INFO ) )
                        {
                            LOGGER.info( "Time spent to convert " + request.fileName + ": "
                                + ( System.currentTimeMillis() - start ) + " ms using " + request.via );
                        }
                    }
                    catch ( XDocConverterException e )
                    {

                        if ( LOGGER.isLoggable( Level.SEVERE ) )
                        {
                            LOGGER.log( Level.SEVERE, "Converter error", e );
                        }
                        throw new WebApplicationException( e );
                    }
                    catch ( RuntimeException e )
                    {

                        if ( LOGGER.isLoggable( Level.SEVERE ) )
                        {
                            LOGGER.log( Level.SEVERE, "RuntimeException", e );
                        }
                        throw new WebApplicationException( e );
                    }
                    finally
                    {
                        IOUtils.closeQuietly( out );
                    }

                }
            };
            // 5) Create the JAX-RS response builder.
            ResponseBuilder responseBuilder = Response.ok( output, MediaType.valueOf( to.getMimeType() ) );
           /* if ( request.download )
            {
                // The converted document must be downloaded, add teh well content-disposition header.
                String fileName = request.fileName;
                responseBuilder.header( HttpHeaderUtils.CONTENT_DISPOSITION_HEADER,
                                        HttpHeaderUtils.getAttachmentFileName( getOutputFileName( fileName, to ) ) );
            }*/
            return responseBuilder.build();

        }
        catch ( Exception e )
        {
            throw new RuntimeException( e );
        }
        
    }

    /**
     * Returns the output file name.
     * 
     * @param filename
     * @param to
     * @return
     */
    protected String getOutputFileName( String filename, ConverterTypeTo to )
    {
        StringBuilder name = new StringBuilder( filename.replace( '.', '_' ) );
        name.append( '.' );
        name.append( to.getExtension() );
        return name.toString();
    }
}