package fr.opensagres.xdocreport.remoting.domain;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class JsonMidiMessage {

	
	public int note;
	
	public int command;
	
	public int velocity;
	
	public int channel;
	
}
