package fr.opensagres.xdocreport.remoting.domain;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ConvertRequest {

	public String outputFormat;
//  TODO ?
//	public DataSource content;
	public String document;
	public String via;
	public boolean download;

}
